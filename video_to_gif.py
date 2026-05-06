from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path


DEFAULT_INPUT = Path("Interactive Mercator.mp4")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Convert a video into a smaller GIF using ffmpeg palette optimization.",
    )
    parser.add_argument(
        "input",
        nargs="?",
        default=str(DEFAULT_INPUT),
        help="Input video path. Defaults to the recording in this repo root.",
    )
    parser.add_argument(
        "output",
        nargs="?",
        help="Output GIF path. Defaults to the input name with a .gif extension.",
    )
    parser.add_argument(
        "--width",
        type=int,
        default=720,
        help="Target GIF width in pixels. Lower values reduce file size. Default: 720.",
    )
    parser.add_argument(
        "--fps",
        type=int,
        default=12,
        help="Target GIF frame rate. Lower values reduce file size. Default: 12.",
    )
    parser.add_argument(
        "--colors",
        type=int,
        default=96,
        help="Palette size from 2 to 256. Lower values reduce file size. Default: 96.",
    )
    parser.add_argument(
        "--start",
        help="Optional start time, for example 00:00:02.5.",
    )
    parser.add_argument(
        "--duration",
        type=float,
        help="Optional clip length in seconds.",
    )
    return parser.parse_args()


def build_filter(width: int, fps: int) -> str:
    return f"fps={fps},scale={width}:-1:flags=lanczos"


def run_ffmpeg(command: list[str]) -> None:
    completed = subprocess.run(command, capture_output=True, text=True)
    if completed.returncode != 0:
        error_text = completed.stderr.strip() or completed.stdout.strip() or "ffmpeg failed"
        raise RuntimeError(error_text)


def main() -> int:
    args = parse_args()

    if shutil.which("ffmpeg") is None:
        print("ffmpeg not found on PATH. Install ffmpeg, then rerun this script.", file=sys.stderr)
        return 1

    input_path = Path(args.input).expanduser().resolve()
    if not input_path.exists():
        print(f"Input video not found: {input_path}", file=sys.stderr)
        return 1

    if args.width <= 0:
        print("--width must be greater than 0.", file=sys.stderr)
        return 1

    if args.fps <= 0:
        print("--fps must be greater than 0.", file=sys.stderr)
        return 1

    if not 2 <= args.colors <= 256:
        print("--colors must be between 2 and 256.", file=sys.stderr)
        return 1

    output_path = Path(args.output).expanduser().resolve() if args.output else input_path.with_suffix(".gif")
    output_path.parent.mkdir(parents=True, exist_ok=True)

    common_args = ["ffmpeg", "-y"]
    if args.start:
        common_args.extend(["-ss", args.start])
    common_args.extend(["-i", str(input_path)])
    if args.duration is not None:
        common_args.extend(["-t", str(args.duration)])

    filter_chain = build_filter(args.width, args.fps)

    with tempfile.TemporaryDirectory() as temp_dir:
        palette_path = Path(temp_dir) / "palette.png"

        palette_command = [
            *common_args,
            "-vf",
            f"{filter_chain},palettegen=max_colors={args.colors}:stats_mode=diff",
            str(palette_path),
        ]

        gif_command = [
            *common_args,
            "-i",
            str(palette_path),
            "-lavfi",
            (
                f"{filter_chain}[x];"
                f"[x][1:v]paletteuse=dither=bayer:bayer_scale=3:diff_mode=rectangle"
            ),
            "-loop",
            "0",
            str(output_path),
        ]

        try:
            run_ffmpeg(palette_command)
            run_ffmpeg(gif_command)
        except RuntimeError as error:
            print(str(error), file=sys.stderr)
            return 1

    print(f"Saved GIF to {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())