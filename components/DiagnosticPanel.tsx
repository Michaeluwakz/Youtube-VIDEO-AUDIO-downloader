'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle, Loader2, Bug } from 'lucide-react';

interface DiagnosticResult {
  timestamp: string;
  tests: Array<{
    name: string;
    status: 'pass' | 'fail';
    message: string;
    fullError?: {
      name: string;
      message: string;
      stack?: string;
    };
    title?: string;
    formatCount?: number;
  }>;
}

export default function DiagnosticPanel() {
  const [showPanel, setShowPanel] = useState(false);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<DiagnosticResult | null>(null);

  const runDiagnostics = async () => {
    setRunning(true);
    setResults(null);

    try {
      const response = await fetch('/api/test');
      const data = await response.json();
      setResults(data);
    } catch (error) {
      setResults({
        timestamp: new Date().toISOString(),
        tests: [{
          name: 'API Connection',
          status: 'fail',
          message: error instanceof Error ? error.message : 'Failed to connect to API'
        }]
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <>
      {/* Diagnostic Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => setShowPanel(true)}
        className="fixed bottom-6 left-6 bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-full shadow-lg z-40"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bug className="h-6 w-6" />
      </motion.button>

      {/* Diagnostic Panel */}
      <AnimatePresence>
        {showPanel && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPanel(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bug className="h-6 w-6 text-orange-600" />
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                      System Diagnostics
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowPanel(false)}
                    className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                  Run tests to identify download issues
                </p>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <button
                  onClick={runDiagnostics}
                  disabled={running}
                  className="w-full py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 mb-6"
                >
                  {running ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Running Tests...
                    </>
                  ) : (
                    <>
                      <Bug className="h-5 w-5" />
                      Run Diagnostics
                    </>
                  )}
                </button>

                {results && (
                  <div className="space-y-4">
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      Test run: {new Date(results.timestamp).toLocaleString()}
                    </div>

                    {results.tests.map((test, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-xl border-2 ${
                          test.status === 'pass'
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {test.status === 'pass' ? (
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-neutral-900 dark:text-white">
                              {test.name}
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                              {test.message}
                            </p>
                            {test.fullError && (
                              <details className="mt-2">
                                <summary className="text-xs text-neutral-500 cursor-pointer hover:text-neutral-700">
                                  View full error
                                </summary>
                                <pre className="mt-2 text-xs bg-neutral-100 dark:bg-neutral-800 p-2 rounded overflow-x-auto">
                                  {JSON.stringify(test.fullError, null, 2)}
                                </pre>
                              </details>
                            )}
                            {test.title && (
                              <div className="mt-2 text-xs text-neutral-500">
                                <strong>Video:</strong> {test.title}
                                <br />
                                <strong>Formats found:</strong> {test.formatCount}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Summary */}
                    <div className="mt-6 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
                      <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
                        Diagnostic Summary
                      </h3>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-neutral-600 dark:text-neutral-400">Total tests:</span>
                          <span className="font-medium">{results.tests.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-600">Passed:</span>
                          <span className="font-medium">{results.tests.filter((t) => t.status === 'pass').length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-red-600">Failed:</span>
                          <span className="font-medium">{results.tests.filter((t) => t.status === 'fail').length}</span>
                        </div>
                      </div>

                      {results.tests.some((t) => t.status === 'fail') && (
                        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div className="text-xs text-yellow-800 dark:text-yellow-200">
                              <strong>Issues detected!</strong>
                              <p className="mt-1">
                                {results.tests.find((t) => t.name === 'Get video info' && t.status === 'fail')
                                  ? 'YouTube is blocking video info requests. This is the most common issue. Try using a VPN or wait a few minutes.'
                                  : 'Check the failed tests above for details.'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {!results && !running && (
                  <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
                    <Bug className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Click &quot;Run Diagnostics&quot; to test the system</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

