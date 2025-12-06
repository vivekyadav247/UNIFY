import React, { useRef } from "react";
import { Upload, Download } from "lucide-react";

/**
 * Props:
 *  onSubmit(file) -> callback when user selects a file
 *  downloadFilename: string
 *  downloadContent: string
 */
export default function SubmitDownloadButtons({
  onSubmit = () => {},
  downloadFilename = "assignment.txt",
  downloadContent = "This is a sample assignment file.",
}) {
  const fileRef = useRef(null);

  function triggerSubmit() {
    fileRef.current?.click();
  }

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (f) {
      // pass file to parent
      onSubmit(f);
    }
    // reset input so same file can be picked again if needed
    e.target.value = "";
  }

  function handleDownload() {
    const blob = new Blob([downloadContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadFilename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex items-center gap-3">
      <input
        ref={fileRef}
        type="file"
        className="hidden"
        onChange={handleFile}
      />

      <button
        onClick={triggerSubmit}
        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl shadow hover:bg-blue-700 transition"
      >
        <Upload size={16} /> Submit Assignment
      </button>

      <button
        onClick={handleDownload}
        className="flex items-center gap-2 px-4 py-3 rounded-xl border hover:shadow transition"
      >
        <Download size={16} /> Download
      </button>
    </div>
  );
}
