'use client';

import { useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useInView } from 'react-intersection-observer';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import {
  Fullscreen,
  Download,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

interface Props {
  fileUrl: string;
}

export default function PDFViewer({ fileUrl }: Props) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState(1.2);
  const containerRef = useRef<HTMLDivElement>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

  const toggleFullscreen = () => {
    const elem = containerRef.current;
    if (!elem) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      elem.requestFullscreen();
    }
  };

  const downloadPDF = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileUrl.split('/').pop() || 'document.pdf';
    link.click();
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center px-4 py-6 bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300"
    >
      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button onClick={zoomOut} className="p-2 rounded-lg bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 transition" title="Zoom Out">
          <ZoomOut className="w-5 h-5" />
        </button>
        <span className="self-center font-medium text-sm sm:text-base text-gray-700 dark:text-gray-300">
          Zoom: {(scale * 100).toFixed(0)}%
        </span>
        <button onClick={zoomIn} className="p-2 rounded-lg bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 transition" title="Zoom In">
          <ZoomIn className="w-5 h-5" />
        </button>
        <button onClick={toggleFullscreen} className="p-2 rounded-lg bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 transition" title="Fullscreen">
          <Fullscreen className="w-5 h-5" />
        </button>
        <button onClick={downloadPDF} className="p-2 rounded-lg bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 transition" title="Download">
          <Download className="w-5 h-5" />
        </button>
      </div>

      {/* PDF Viewer */}
      <div className="w-full max-h-[80vh] overflow-y-auto bg-gray-100 dark:bg-gray-900 rounded-lg p-2">
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading="Loading PDF..."
          error="Failed to load PDF."
        >
          {Array.from(new Array(numPages || 0), (_, index) => (
            <OptimizedLazyPage
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              scale={scale}
            />
          ))}
        </Document>
      </div>

      {numPages && (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Total Pages: {numPages}
        </p>
      )}
    </div>
  );
}

function OptimizedLazyPage({
  pageNumber,
  scale,
}: {
  pageNumber: number;
  scale: number;
}) {
  const { ref, inView } = useInView({
    triggerOnce: false,
    rootMargin: '1000px', // preloads 1000px before visible
  });

  return (
    <div
      ref={ref}
      className="my-6 flex justify-center min-h-[300px] sm:min-h-[400px]"
    >
      {inView ? (
        <Page
          pageNumber={pageNumber}
          scale={scale}
          renderAnnotationLayer={false}
          renderTextLayer={false}
          className="shadow-md"
        />
      ) : (
        <div className="w-full max-w-[90%] h-[300px] sm:h-[400px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      )}
    </div>
  );
}
