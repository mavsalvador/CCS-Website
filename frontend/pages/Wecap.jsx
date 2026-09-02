import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import '../styles/index.css';
import { Header } from "../components/Header.jsx"
import { formatWecapDate } from '../lib/wecapDates.js';
import { WecapCards } from "./Archive.jsx";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import pdfWorker from "pdfjs-dist/legacy/build/pdf.worker.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const PdfPreview = ({ fileUrl, fileName }) => {
  const viewerRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const renderTasks = [];
    let loadingTask = null;
    let isCancelled = false;
    const controller = new AbortController();
    const viewer = viewerRef.current;

    const renderPdf = async () => {
      setError("");
      viewer?.replaceChildren();

      try {
        const response = await fetch(fileUrl, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`PDF request failed with ${response.status}`);
        }

        const pdfData = new Uint8Array(await response.arrayBuffer());
        loadingTask = pdfjsLib.getDocument({ data: pdfData });
        const pdf = await loadingTask.promise;

        if (!viewer || isCancelled) {
          return;
        }

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          if (isCancelled) {
            return;
          }

          const page = await pdf.getPage(pageNumber);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.className = "pdf-page-canvas";
          canvas.setAttribute("aria-label", `${fileName} page ${pageNumber}`);

          viewer.appendChild(canvas);

          const renderTask = page.render({
            canvasContext: context,
            viewport,
          });

          renderTasks.push(renderTask);
          await renderTask.promise;
        }
      } catch (error) {
        if (!isCancelled && error.name !== "AbortError") {
          console.error("PDF preview failed:", error);
          setError("This PDF preview could not be loaded.");
        }
      }
    };

    renderPdf();

    return () => {
      isCancelled = true;
      controller.abort();
      renderTasks.forEach((task) => task.cancel());
      loadingTask?.destroy();
      viewer?.replaceChildren();
    };
  }, [fileUrl]);

  return (
     
    <div className="pdf-decor">
      <div className="pdf-viewer-scroll">
        {error ? (
          <p style={{ padding: '20px', margin: 0 }}>{error}</p>
        ) : (
          <div
            ref={viewerRef}
            aria-label={fileName}
            className="pdf-viewer-pages"
          />
        )}
      </div>
    </div>
  );
};

const WecapViewer = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadRecentWecaps() {
      try {
        const response = await fetch(`${apiUrl}/api/wecaps-main`, {
          credentials: 'include',
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Wecaps request failed with ${response.status}`);
        }

        const data = await response.json();
        const recentWecaps = (data.recent_wecaps || []).map((doc) => ({
          ...doc,
          filePath: `${apiUrl}/api/get-pdf/${doc.id}`,
        }));

        setDocuments(recentWecaps);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to load recent Wecaps:", error);
          setError("Wecaps could not be loaded right now.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadRecentWecaps();

    return () => controller.abort();
  }, [apiUrl]);

  const latestDoc = documents[0];
  const olderDocs = documents.slice(1);

  return (<>
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '50px' }}>
      {isLoading && (
        <p className="simple-font text-center">Loading Wecaps...</p>
      )}

      {error && (
        <p className="simple-font text-center">{error}</p>
      )}

      {latestDoc && (
        <div style={{ marginBottom: '40px' }}>
          <div className="mb-8">
          <h1 className="text-4xl nice-font !font-bold mb-8 text-center">Latest Wecap: {formatWecapDate(latestDoc.uploaded_at)}</h1>
          <hr className="gradient-line" />
          </div>
          
          <PdfPreview fileUrl={latestDoc.filePath} fileName={latestDoc.file_name} />
          <a
            href={latestDoc.filePath}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', marginTop: '12px', color: '#b98d35', fontWeight: 'bold' }}
            className='simple-font'
          >
            Open in a new tab
          </a>
        </div>
      )}

      </div>

    <hr className="gradient-line" />

    <div style={{ maxWidth: '100%', margin: '0 auto', padding: '50px' }}>
      {olderDocs.length > 0 && (
        <div style={{ padding: '20px', marginBottom:"10px"}}>
          <h3 className="text-3xl nice-font !font-bold mb-10 text-center">Missed a Week? See our Archive Below</h3>
          
          <div className="wecap-archive-list">
            {olderDocs.map((doc) => (
              <WecapCards
                key={doc.id}
                id={doc.id}
                uploaded_at={doc.uploaded_at}
                filePath={doc.filePath}
                file_name={doc.file_name}
              />
            ))}
          </div>
        </div>
      )}

          <div className='flex flex-row items-center justify-center'>
              <Link to="/wecap-archive" className="wecap-see-all simple-font">
                See all Wecaps ⌯⌲
              </Link>
            </div>
        </div>
        </>
    

  );
}


export const Wecap = () => {
  return (
    <div>
        <Header title="WeCaps" subtitle="Past and present newsletters"/>
        <WecapViewer/>
    </div>
  );
};
