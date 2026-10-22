"""Render CATMINAL to MP4 (or a few PNG stills) with headless Chromium + ffmpeg.

usage:
  python scripts/render.py video            # -> out/catminal.mp4 (30s, 1080x1350, 30fps, with audio)
  python scripts/render.py stills 2.9 7.3   # -> out/still_XX.XX.png

env:
  CHROME_PATH   optional path to a Chromium/Chrome binary (otherwise Playwright's bundled one)
"""
import base64, os, subprocess, sys
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'out')
HTML = 'file://' + os.path.join(ROOT, 'index.html')
FPS, DUR = 30, 30


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else 'video'
    os.makedirs(OUT, exist_ok=True)
    with sync_playwright() as p:
        kw = {'args': ['--disable-gpu']}
        if os.environ.get('CHROME_PATH'):
            kw['executable_path'] = os.environ['CHROME_PATH']
        browser = p.chromium.launch(**kw)
        page = browser.new_page(viewport={'width': 1080, 'height': 1350})
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.goto(HTML)
        page.wait_for_timeout(500)
        if errors:
            sys.exit(f'page errors: {errors}')

        def frame(t):
            return base64.b64decode(page.evaluate(f'frameData({t})').split(',')[1])

        if mode == 'stills':
            for t in map(float, sys.argv[2:] or ['2.9', '7.3', '29.5']):
                path = os.path.join(OUT, f'still_{t:05.2f}.png')
                open(path, 'wb').write(frame(t))
                print('saved', path)
        else:
            silent = os.path.join(OUT, 'frames.mp4')
            ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', str(FPS),
                                   '-c:v', 'png', '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '16',
                                   '-preset', 'slow', silent], stdin=subprocess.PIPE)
            for f in range(FPS * DUR):
                ff.stdin.write(frame(f / FPS))
                if f % 150 == 0:
                    print(f'frame {f}/{FPS * DUR}', flush=True)
            ff.stdin.close(); ff.wait()
            wav = os.path.join(OUT, 'audio.wav')
            subprocess.run([sys.executable, os.path.join(ROOT, 'scripts', 'audio.py'), wav], check=True)
            final = os.path.join(OUT, 'catminal.mp4')
            subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', silent, '-i', wav, '-c:v', 'copy', '-c:a', 'aac',
                            '-b:a', '192k', '-shortest', '-movflags', '+faststart', final], check=True)
            print('done ->', final)
        browser.close()


if __name__ == '__main__':
    main()
