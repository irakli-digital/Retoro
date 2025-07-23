'use client'

import Script from 'next/script';
import { useEffect } from 'react';
import { getEnabledScripts, type ScriptConfig } from '@/config/scripts.config';

/**
 * ScriptInjector Component
 * 
 * Automatically injects configured third-party scripts into the document.
 * Handles different loading strategies and provides error handling.
 */

interface ScriptInjectorProps {
  strategy?: ScriptConfig['strategy'];
  onScriptLoad?: (scriptId: string) => void;
  onScriptError?: (scriptId: string, error: Error) => void;
}

export default function ScriptInjector({ 
  strategy,
  onScriptLoad,
  onScriptError 
}: ScriptInjectorProps = {}) {
  const enabledScripts = getEnabledScripts();
  
  // Filter scripts by strategy if specified
  const scriptsToLoad = strategy 
    ? enabledScripts.filter(script => script.strategy === strategy)
    : enabledScripts;

  useEffect(() => {
    // Add GTM noscript fallback for users with JavaScript disabled
    const gtmScript = enabledScripts.find(script => script.id === 'google-tag-manager');
    if (gtmScript && process.env.NEXT_PUBLIC_GTM_ID) {
      const noscript = document.createElement('noscript');
      noscript.innerHTML = `
        <iframe src="https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}"
                height="0" width="0" style="display:none;visibility:hidden"></iframe>
      `;
      document.body.insertBefore(noscript, document.body.firstChild);
    }
  }, [enabledScripts]);

  const handleScriptLoad = (scriptId: string) => {
    console.log(`✅ Script loaded: ${scriptId}`);
    onScriptLoad?.(scriptId);
  };

  const handleScriptError = (scriptId: string, error: Event) => {
    const errorObj = new Error(`Failed to load script: ${scriptId}`);
    console.error(`❌ Script error: ${scriptId}`, error);
    onScriptError?.(scriptId, errorObj);
  };

  return (
    <>
      {scriptsToLoad.map((script) => {
        // For scripts with src (external scripts)
        if (script.src) {
          return (
            <Script
              key={script.id}
              id={script.id}
              src={script.src}
              strategy={script.strategy || 'afterInteractive'}
              async={script.async}
              defer={script.defer}
              onLoad={() => handleScriptLoad(script.id)}
              onError={(error) => handleScriptError(script.id, error)}
              {...script.dataAttributes}
            />
          );
        }

        // For scripts with inline content
        if (script.content) {
          return (
            <Script
              key={script.id}
              id={script.id}
              strategy={script.strategy || 'afterInteractive'}
              dangerouslySetInnerHTML={{ __html: script.content }}
              onLoad={() => handleScriptLoad(script.id)}
              onError={(error) => handleScriptError(script.id, error)}
            />
          );
        }

        return null;
      })}
    </>
  );
}

/**
 * Specialized components for different loading strategies
 */

export function BeforeInteractiveScripts() {
  return <ScriptInjector strategy="beforeInteractive" />;
}

export function AfterInteractiveScripts() {
  return <ScriptInjector strategy="afterInteractive" />;
}

export function LazyScripts() {
  return <ScriptInjector strategy="lazyOnload" />;
}

export function WorkerScripts() {
  return <ScriptInjector strategy="worker" />;
}