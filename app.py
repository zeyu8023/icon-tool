from flask import Flask, render_template, request, send_from_directory
import os, shutil, datetime, subprocess

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
STATIC_UPLOAD_FOLDER = os.path.join('static', 'uploads')
OUTPUT_FOLDER = 'output'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(STATIC_UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def process_image(filepath, background, output_path):
    filename = os.path.basename(filepath)
    name, ext = os.path.splitext(filename)
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    outname = f"{name}_{timestamp}{ext}"
    outpath = os.path.join(output_path, outname)

    cmd = [
        "magick", filepath,
        "-resize", "225x225",
        "-gravity", "center",
        "-background", background,
        "-extent", "256x256",
        outpath
    ]
    try:
        subprocess.run(cmd, check=True)
        return outname, True
    except subprocess.CalledProcessError:
        return filename, False

@app.route("/", methods=["GET", "POST"])
def index():
    log = []
    previews = []
    if request.method == "POST":
        background = "none" if request.form.get("bg") == "transparent" else "white"
        uploaded_files = request.files.getlist("files")

        shutil.rmtree(UPLOAD_FOLDER, ignore_errors=True)
        shutil.rmtree(STATIC_UPLOAD_FOLDER, ignore_errors=True)
        shutil.rmtree(OUTPUT_FOLDER, ignore_errors=True)
        os.makedirs(UPLOAD_FOLDER)
        os.makedirs(STATIC_UPLOAD_FOLDER)
        os.makedirs(OUTPUT_FOLDER)

        for file in uploaded_files:
            if file and allowed_file(file.filename):
                filepath = os.path.join(UPLOAD_FOLDER, file.filename)
                file.save(filepath)

                # 复制到 static/uploads 供前端预览
                shutil.copy(filepath, os.path.join(STATIC_UPLOAD_FOLDER, file.filename))

                outname, success = process_image(filepath, background, OUTPUT_FOLDER)
                if success:
                    log.append(f"✔ 成功处理: {file.filename} → {outname}")
                    previews.append((file.filename, outname))
                else:
                    log.append(f"✘ 处理失败: {file.filename}")

    output_files = os.listdir(OUTPUT_FOLDER)
    return render_template("index.html", log=log, files=output_files, previews=previews)

@app.route("/download/<filename>")
def download_file(filename):
    return send_from_directory(OUTPUT_FOLDER, filename, as_attachment=True)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5080))
    app.run(host="0.0.0.0", port=port)