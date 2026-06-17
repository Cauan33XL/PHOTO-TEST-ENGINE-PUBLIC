import { useState, useCallback } from 'react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  useSandpack,
} from "@codesandbox/sandpack-react";

type FileSystem = Record<string, string>;

const PASTAS = ['LEGADO', 'CRIADO', 'MODIFICADO'];

// Arquivos Mockados para a Interface Estática Open Source
const physicalFiles: Record<string, string> = {
  "/CRIADO/App.tsx": "import React from 'react';\n\nexport default function App() {\n  return (\n    <div className=\"flex flex-col items-center justify-center min-h-screen text-white bg-zinc-950\">\n      <h1 className=\"text-4xl font-bold text-sky-500 mb-4\">Photo Test Engine UI</h1>\n      <p className=\"text-zinc-400\">Esta é a versão Open Source focada 100% na UI/UX.</p>\n    </div>\n  );\n}\n"
};

// Arquivos base de infraestrutura do React
const BASE_FILES: FileSystem = {
  "/index.tsx": `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './CRIADO/App';
import './styles.css';

const root = createRoot(document.getElementById('root')!);
root.render(<App />);`,
  "/styles.css": "body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; background-color: #0a0a0a; color: #d4d4d4; }",
};

const DEFAULT_FILES: FileSystem = {
  ...BASE_FILES,
  ...physicalFiles
};

const professionalTheme = {
  colors: {
    surface1: "#0a0a0a",
    surface2: "#111111",
    surface3: "#1a1a1a",
    clickable: "#cccccc",
    base: "#d4d4d4",
    disabled: "#52525b",
    hover: "#ffffff",
    accent: "#0ea5e9",
    error: "#f48771",
    errorSurface: "#0a0a0a",
  },
  syntax: {
    plain: "#d4d4d4",
    comment: { color: "#6a9955", fontStyle: "italic" as const },
    keyword: "#569cd6",
    tag: "#569cd6",
    punctuation: "#d4d4d4",
    definition: "#4ec9b0",
    property: "#9cdcfe",
    static: "#dcdcaa",
    string: "#ce9178",
  },
  font: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    mono: 'Consolas, "Courier New", monospace',
    size: "13px",
    lineHeight: "20px",
  },
};


type ModalConfig = {
  isOpen: boolean;
  title: string;
  description?: string;
  defaultValue?: string;
  type: 'input' | 'confirm' | 'alert';
  onConfirm: (val: string) => void;
};

const GerenciadorArquivos: React.FC<{ onExport: () => void; onImport: () => void; onFileSelect: () => void; }> = ({ onExport, onImport, onFileSelect }) => {
  const { sandpack } = useSandpack();
  const { files, activeFile } = sandpack;
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    LEGADO: true,
    CRIADO: true,
    MODIFICADO: true,
    AUTORAL: true
  });

  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const handleExportIndividual = (extension: string) => {
    alert(`Exportação de .${extension} desabilitada na versão de Interface Estática.`);
    setShowExportModal(false);
  };

  const handleImportIndividual = () => {
    alert("Importação Individual desabilitada na versão de Interface Estática.");
    setShowImportModal(false);
  };

  const toggleFolder = (pasta: string) => {
    setExpandedFolders((prev: Record<string, boolean>) => ({ ...prev, [pasta]: !prev[pasta] }));
  };

  const handleAddFile = (pasta: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalConfig({
      isOpen: true,
      title: 'Novo Arquivo',
      description: `Nome do novo arquivo em ${pasta} (sem extensão, será .tsx):`,
      defaultValue: 'NovoComponente',
      type: 'input',
      onConfirm: (filename: string) => {
        if (!filename) {
          setModalConfig(null);
          return;
        }
        const cleanName = filename.replace(/[^a-zA-Z0-9_-]/g, '');
        const path = `/${pasta}/${cleanName}.tsx`;
        if (files[path]) {
          setModalConfig({ isOpen: true, title: 'Erro', description: 'Um arquivo com esse nome já existe.', type: 'alert', onConfirm: () => setModalConfig(null) });
          return;
        }
        sandpack.addFile(path, `import React from 'react';\n\nexport default function ${cleanName}() {\n  return <div>${cleanName}</div>;\n}\n`);
        sandpack.setActiveFile(path);
        onFileSelect();
        setExpandedFolders((prev: Record<string, boolean>) => ({ ...prev, [pasta]: true }));
        setModalConfig(null);
      }
    });
  };

  const handleDeleteFile = (path: string) => {
    if (path.endsWith('/example.tsx') || path.endsWith('/App.tsx') || path.endsWith('/index.tsx')) {
      setModalConfig({ isOpen: true, title: 'Bloqueado', description: 'O ponto de entrada principal não pode ser removido.', type: 'alert', onConfirm: () => setModalConfig(null) });
      return;
    }
    setModalConfig({
      isOpen: true,
      title: 'Confirmar Exclusão',
      description: `Tem certeza que deseja excluir o arquivo ${path}? Esta ação não pode ser desfeita.`,
      type: 'confirm',
      onConfirm: () => {
        sandpack.deleteFile(path);
        setModalConfig(null);
      }
    });
  };

  const handleDuplicate = (path: string) => {
    const currentCode = files[path]?.code;
    if (typeof currentCode === 'string') {
      const filename = path.split('/').pop() || 'Arquivo.tsx';

      setModalConfig({
        isOpen: true,
        title: 'Salvar Cópia',
        description: `Nome para a cópia de ${filename} (será salva em MODIFICADO):`,
        defaultValue: `Copia_${filename}`,
        type: 'input',
        onConfirm: (newFilename: string) => {
          if (!newFilename) {
            setModalConfig(null);
            return;
          }
          const cleanName = newFilename.replace(/^\//, '');
          const targetPath = `/MODIFICADO/${cleanName}`;
          if (files[targetPath]) {
            setModalConfig({ isOpen: true, title: 'Erro', description: 'Um arquivo com esse nome já existe em MODIFICADO.', type: 'alert', onConfirm: () => setModalConfig(null) });
            return;
          }
          sandpack.addFile(targetPath, currentCode);
          sandpack.setActiveFile(targetPath);
          setModalConfig(null);
        }
      });
    }
  };

  return (
    <div className="flex flex-col w-64 border-r border-[#222222] bg-[#111111] text-[#cccccc]">
      <div className="text-xs font-semibold px-4 py-2 border-b border-[#222222] bg-[#0a0a0a] text-[#cccccc] uppercase tracking-wide">
        Explorer
      </div>

      <div className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-[#333333] scrollbar-track-transparent">
        {PASTAS.map(pasta => {
          const folderFiles = Object.keys(files).filter(path => path.startsWith(`/${pasta}/`));
          const isExpanded = expandedFolders[pasta];

          return (
            <div key={pasta} className="flex flex-col mb-1">
              <div
                className="flex justify-between items-center px-4 py-1.5 hover:bg-[#1f1f1f] group transition-colors cursor-pointer select-none"
                onClick={() => toggleFolder(pasta)}
              >
                <div className="flex items-center gap-2">
                  <svg
                    className={`w-3 h-3 text-[#888888] transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                    fill="currentColor" viewBox="0 0 24 24"
                  >
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                  </svg>
                  <svg className="w-3.5 h-3.5 text-[#dcb67a]" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M1.5 3A1.5 1.5 0 013 1.5h3.207a1 1 0 01.707.293l1.586 1.586A1 1 0 009.207 3.5H13A1.5 1.5 0 0114.5 5v8A1.5 1.5 0 0113 14.5H3A1.5 1.5 0 011.5 13V3z" />
                  </svg>
                  <span className="text-xs font-semibold tracking-wide">{pasta}</span>
                </div>
                {pasta !== 'LEGADO' && (
                  <button onClick={(e) => handleAddFile(pasta, e)} className="opacity-0 group-hover:opacity-100 text-[#cccccc] hover:text-white transition-opacity p-0.5 rounded hover:bg-[#333333]" title="Novo Arquivo">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  </button>
                )}
              </div>

              <div className={`flex flex-col transition-all duration-300 origin-top overflow-hidden ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                {folderFiles.length === 0 ? (
                  <div className="px-4 pl-10 py-1 text-[11px] text-[#666666] italic">
                    Pasta vazia
                  </div>
                ) : (
                  folderFiles.map(path => {
                    const fileName = path.replace(`/${pasta}/`, '');
                    const isActive = activeFile === path;
                    return (
                      <div key={path} className={`flex flex-col transition-all ${isActive ? 'bg-[#262626] text-white' : 'text-[#cccccc] hover:bg-[#1f1f1f] hover:text-white'}`}>
                        <div className="flex justify-between items-center px-4 pl-10 py-1 cursor-pointer" onClick={() => { sandpack.setActiveFile(path); onFileSelect(); }}>
                          <div className="flex items-center gap-2">
                            <svg className="w-3 h-3 text-[#519aba]" fill="currentColor" viewBox="0 0 16 16"><path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z" /></svg>
                            <span className="text-[13px]">{fileName}</span>
                          </div>
                        </div>

                        {isActive && pasta !== 'LEGADO' && (
                          <div className="flex gap-2 px-4 pl-10 py-1.5 bg-[#1a1a1a] border-t border-b border-[#222222]">
                            <button
                              onClick={() => handleDuplicate(path)}
                              className="text-[11px] font-medium px-2 py-0.5 bg-[#0e639c] text-white hover:bg-[#1177bb] transition-colors rounded shadow-sm flex items-center gap-1"
                            >
                              Salvar Cópia
                            </button>
                            {!path.endsWith('/example.tsx') && !path.endsWith('/App.tsx') && (
                              <button
                                onClick={() => handleDeleteFile(path)}
                                className="text-[11px] font-medium px-2 py-0.5 bg-transparent text-[#f48771] border border-[#f48771] hover:bg-[#f48771] hover:text-white transition-colors rounded flex items-center gap-1"
                                title="Excluir"
                              >
                                Excluir
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-[#222222] p-3 flex flex-col gap-2 bg-[#111111]">
        <button onClick={() => setShowImportModal(true)} className="w-full text-center text-xs font-medium bg-[#222222] text-white py-1.5 hover:bg-[#333333] transition-colors rounded">
          Importar...
        </button>
        <button onClick={() => setShowExportModal(true)} className="w-full text-center text-xs font-medium bg-[#0ea5e9] text-white py-1.5 hover:bg-[#0284c7] transition-colors rounded">
          Exportar...
        </button>
      </div>

      {modalConfig?.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#00000099] backdrop-blur-sm">
          <div className="bg-[#111111] border border-[#333333] rounded-lg shadow-2xl p-5 w-80 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-white font-medium text-sm">{modalConfig.title}</h3>
            {modalConfig.description && <p className="text-[#888888] text-xs">{modalConfig.description}</p>}

            {modalConfig.type === 'input' && (
              <input
                autoFocus
                className="bg-[#0a0a0a] border border-[#333333] text-white px-3 py-2 rounded outline-none focus:border-[#0ea5e9] text-sm w-full"
                defaultValue={modalConfig.defaultValue}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') modalConfig.onConfirm(e.currentTarget.value);
                  if (e.key === 'Escape') setModalConfig(null);
                }}
                id="modal-input"
              />
            )}

            <div className="flex justify-end gap-2 mt-2">
              {modalConfig.type !== 'alert' && (
                <button
                  onClick={() => setModalConfig(null)}
                  className="px-3 py-1.5 text-xs text-[#cccccc] hover:bg-[#222222] rounded transition-colors font-medium"
                >
                  Cancelar
                </button>
              )}
              <button
                onClick={() => {
                  const val = modalConfig.type === 'input' ? (document.getElementById('modal-input') as HTMLInputElement)?.value : '';
                  modalConfig.onConfirm(val);
                }}
                className={`px-3 py-1.5 text-xs text-white rounded transition-colors font-medium ${modalConfig.type === 'confirm' ? 'bg-[#f48771] hover:bg-[#d46a55]' : 'bg-[#0ea5e9] hover:bg-[#0284c7]'}`}
              >
                {modalConfig.type === 'alert' ? 'OK' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showExportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#00000099] backdrop-blur-sm">
          <div className="bg-[#111111] border border-[#333333] rounded-lg shadow-2xl p-5 w-80 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-white font-medium text-sm border-b border-[#222222] pb-2">Exportar</h3>

            <div className="flex flex-col gap-2">
              <span className="text-[#888888] text-[10px] uppercase font-bold tracking-wider">Projeto Completo</span>
              <button onClick={() => { onExport(); setShowExportModal(false); }} className="w-full text-left text-xs px-3 py-2 bg-[#222222] hover:bg-[#333333] text-white rounded transition-colors flex items-center justify-between">
                <span>Projeto em JSON</span>
                <span className="text-[10px] bg-[#333333] px-1.5 py-0.5 rounded text-[#aaaaaa]">.json</span>
              </button>

              <span className="text-[#888888] text-[10px] uppercase font-bold tracking-wider mt-2">Arquivo Ativo ({activeFile.split('/').pop()})</span>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => handleExportIndividual('tsx')} className="text-xs px-3 py-2 bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 hover:bg-[#0ea5e9]/20 text-[#0ea5e9] rounded transition-colors flex justify-center">
                  TSX
                </button>
                <button onClick={() => handleExportIndividual('jsx')} className="text-xs px-3 py-2 bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 hover:bg-[#0ea5e9]/20 text-[#0ea5e9] rounded transition-colors flex justify-center">
                  JSX
                </button>
                <button onClick={() => handleExportIndividual('txt')} className="text-xs px-3 py-2 bg-[#222222] hover:bg-[#333333] text-[#cccccc] rounded transition-colors flex justify-center">
                  TXT
                </button>
                <button onClick={() => handleExportIndividual('md')} className="text-xs px-3 py-2 bg-[#222222] hover:bg-[#333333] text-[#cccccc] rounded transition-colors flex justify-center">
                  MD
                </button>
              </div>
            </div>

            <div className="flex justify-end mt-2 pt-3 border-t border-[#222222]">
              <button onClick={() => setShowExportModal(false)} className="px-4 py-1.5 text-xs text-[#cccccc] hover:text-white transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showImportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#00000099] backdrop-blur-sm">
          <div className="bg-[#111111] border border-[#333333] rounded-lg shadow-2xl p-5 w-80 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-white font-medium text-sm border-b border-[#222222] pb-2">Importar</h3>

            <div className="flex flex-col gap-2">
              <span className="text-[#888888] text-[10px] uppercase font-bold tracking-wider">Projeto Completo</span>
              <button onClick={() => { onImport(); setShowImportModal(false); }} className="w-full text-left text-xs px-3 py-2 bg-[#222222] hover:bg-[#333333] text-[#f48771] rounded transition-colors flex items-center justify-between border border-transparent hover:border-[#f48771]/30">
                <span>Substituir tudo por JSON</span>
                <span className="text-[10px] bg-[#f48771]/10 px-1.5 py-0.5 rounded">.json</span>
              </button>

              <span className="text-[#888888] text-[10px] uppercase font-bold tracking-wider mt-2">Arquivos Individuais</span>
              <button onClick={handleImportIndividual} className="w-full text-left text-xs px-3 py-2 bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 hover:bg-[#0ea5e9]/20 text-[#0ea5e9] rounded transition-colors flex flex-col gap-1">
                <div className="flex items-center justify-between w-full">
                  <span>Importar Arquivo(s)</span>
                  <span className="text-[10px] bg-[#0ea5e9]/20 px-1.5 py-0.5 rounded">.tsx, .jsx, etc</span>
                </div>
                <span className="text-[10px] text-[#888888]">Serão salvos na pasta MODIFICADO</span>
              </button>
            </div>

            <div className="flex justify-end mt-2 pt-3 border-t border-[#222222]">
              <button onClick={() => setShowImportModal(false)} className="px-4 py-1.5 text-xs text-[#cccccc] hover:text-white transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const ExportWrapper = ({ onExportData, onImportData, onFileSelect }: { onExportData: (files: Record<string, { code: string }>) => void, onImportData: () => void, onFileSelect: () => void }) => {
  const { sandpack } = useSandpack();
  return <GerenciadorArquivos onExport={() => onExportData(sandpack.files as unknown as Record<string, { code: string }>)} onImport={onImportData} onFileSelect={onFileSelect} />;
};

const EditorWrapper = ({ hasSelectedFile, onCloseFile }: { hasSelectedFile: boolean, onCloseFile: () => void }) => {
  const { sandpack } = useSandpack();
  const isReadOnly = sandpack.activeFile.startsWith('/LEGADO/');
  const fileName = sandpack.activeFile.split('/').pop() || '';

  if (!hasSelectedFile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0a0a0a] h-full w-full border-l border-[#222222]">
        <svg className="w-16 h-16 text-[#333333] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        <p className="text-[#666666] text-sm font-medium">Nenhum arquivo selecionado</p>
        <p className="text-[#444444] text-xs mt-1">Selecione um arquivo no menu lateral para visualizar o código.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0a] h-full w-full overflow-hidden min-w-0 border-l border-[#222222]">
      <div className="text-[11px] font-medium px-4 py-2 border-b border-[#222222] bg-[#111111] text-[#cccccc] uppercase tracking-wide flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span>Editor</span>
          <span className="text-[#888888] normal-case">- {fileName}</span>
        </div>
        <div className="flex items-center gap-3">
          {isReadOnly && <span className="text-[#f48771] bg-[#f48771]/10 px-2 py-0.5 rounded-sm flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg> Somente Leitura (LEGADO)</span>}
          <button onClick={onCloseFile} className="text-[#888888] hover:text-[#f48771] transition-colors p-1" title="Fechar Arquivo">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      </div>
      <SandpackCodeEditor
        showLineNumbers
        showTabs={false}
        readOnly={isReadOnly}
        className="flex-1"
        style={{ height: "100%" }}
      />
    </div>
  );
};

const SANDPACK_CUSTOM_SETUP = {
  dependencies: {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "framer-motion": "^10.16.4",
    "lucide-react": "^0.284.0"
  }
};

const getInitialFiles = (): FileSystem => {
  return DEFAULT_FILES;
};

export default function VisualizadorArquivos() {
  const [globalFiles] = useState<FileSystem>(getInitialFiles);
  const [importCounter] = useState(0);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [hasSelectedFile, setHasSelectedFile] = useState(false);
  const handleImportData = useCallback(() => {
    alert("Função de Importação de Projeto Completo desabilitada na versão de Interface Estática.");
  }, []);

  const handleExportFromInner = useCallback((_files: Record<string, { code: string }>) => {
    alert("Função de Exportação de Projeto Completo desabilitada na versão de Interface Estática.");
  }, []);

  const sandpackKey = `engine-${importCounter}`;

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-[#cccccc] font-sans overflow-hidden">
      <main className="flex-1 flex flex-col relative w-full h-full">

        <header className="h-12 border-b border-[#222222] flex justify-between items-center bg-[#111111] px-4 select-none">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-[#0e639c]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
            <div className="flex flex-col">
              <h1 className="text-[14px] text-[#cccccc] leading-tight mt-0.5" style={{ fontFamily: 'Xirod, sans-serif', letterSpacing: '1px' }}>
                PHOTO TEST ENGINE (BLANCH)
              </h1>
              <span className="text-[9px] text-[#888888] font-medium tracking-widest uppercase">
                Gemini Canvas Apps
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://photo-test-engine.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] font-bold bg-[#0e639c] text-white px-3 py-1.5 rounded hover:bg-[#1177bb] transition-colors flex items-center gap-2"
              title="Acessar a versão completa"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
              VERSÃO OFICIAL
            </a>
            <button
              onClick={() => setIsManualOpen(true)}
              className="text-[12px] font-bold bg-[#333333] text-[#cccccc] px-3 py-1.5 rounded hover:bg-[#444444] hover:text-white transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              MANUAL
            </button>
            <span className="text-[11px] bg-[#222222] text-[#cccccc] px-2 py-0.5 rounded-sm font-medium">
              Ambiente de Desenvolvimento
            </span>
          </div>
        </header>

        <div
          className="flex-1 overflow-hidden flex flex-col h-full w-full"
          style={{ '--sp-layout-height': '100%' } as React.CSSProperties}
        >
          <style>{`
            @import url('https://fonts.cdnfonts.com/css/xirod');
            .sp-layout { height: 100% !important; min-height: 100% !important; }
            .sp-wrapper { height: 100% !important; min-height: 100% !important; flex: 1 !important; }
            .sp-stack { height: 100% !important; min-height: 100% !important; flex: 1 !important; }
            .cm-editor { height: 100% !important; }
          `}</style>

          <SandpackProvider
            key={sandpackKey}
            template="react-ts"
            theme={professionalTheme}
            files={globalFiles}
            customSetup={SANDPACK_CUSTOM_SETUP}
            options={{
              externalResources: ["https://cdn.tailwindcss.com"]
            }}
          >


            <SandpackLayout className="!border-0 !rounded-none !bg-transparent flex-1 w-full flex flex-row !flex-nowrap overflow-hidden" style={{ height: "100%", minHeight: "100%" }}>

              <ExportWrapper onExportData={handleExportFromInner} onImportData={handleImportData} onFileSelect={() => setHasSelectedFile(true)} />

              <EditorWrapper hasSelectedFile={hasSelectedFile} onCloseFile={() => setHasSelectedFile(false)} />



              {isManualOpen && (
                <div className="fixed inset-0 z-[60] bg-[#000000cc] backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="w-full max-w-2xl bg-[#0a0a0a] border border-[#333333] rounded-xl shadow-2xl flex flex-col overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
                    <div className="h-12 bg-[#111111] border-b border-[#222222] flex justify-between items-center px-6">
                      <h2 className="text-[14px] font-semibold text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#0ea5e9]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                        Manual do Usuário
                      </h2>
                      <button
                        onClick={() => setIsManualOpen(false)}
                        className="text-[#888888] hover:text-white transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>

                    <div className="p-6 overflow-y-auto max-h-[70vh] flex flex-col gap-6 text-[13px] leading-relaxed text-[#bbbbbb]">

                      <section>
                        <h3 className="text-white font-medium text-[14px] mb-2 flex items-center gap-2">
                          <span className="text-[#0ea5e9]">1.</span> O que é o Photo Test Engine?
                        </h3>
                        <p>
                          Um ambiente de testes projetado especificamente para desenvolver, testar e empacotar <strong>Aplicações Web em React criadas no Gemini (Canvas)</strong>. Ele provê um simulador (Sandpack) que garante que o código funcionará isoladamente.
                        </p>
                      </section>

                      <section>
                        <h3 className="text-white font-medium text-[14px] mb-2 flex items-center gap-2">
                          <span className="text-[#0ea5e9]">2.</span> Estrutura de Pastas
                        </h3>
                        <ul className="list-disc list-inside space-y-2 ml-1">
                          <li><strong className="text-white">LEGADO:</strong> Contém protótipos e códigos antigos que vieram da versão inicial do Canvas. <span className="text-[#f48771] font-medium">Esta pasta é apenas leitura.</span> Não é possível editar, excluir ou salvar cópias diretamente aqui.</li>
                          <li><strong className="text-white">CRIADO:</strong> Onde novos arquivos base e rascunhos devem ser criados e desenvolvidos inicialmente.</li>
                          <li><strong className="text-white">MODIFICADO:</strong> Reservado para arquivos que já passaram por revisão ou que são evoluções diretas dos códigos originais (Legado).</li>

                        </ul>
                      </section>

                      <section>
                        <h3 className="text-white font-medium text-[14px] mb-2 flex items-center gap-2">
                          <span className="text-[#0ea5e9]">3.</span> Interface Estática (Open Source)
                        </h3>
                        <p>
                          Esta é a versão <strong>estática</strong> da Photo Test Engine. Ela fornece os componentes de interface, modais e o design system (UI/UX) para que você possa estudar ou utilizar como template para <strong>construir seu próprio motor de testes e execução.</strong> As funcionalidades avançadas de compilação em tempo real e injeção de API Keys foram removidas do código público para dar liberdade aos desenvolvedores.
                        </p>
                      </section>

                      <section>
                        <h3 className="text-white font-medium text-[14px] mb-2 flex items-center gap-2">
                          <span className="text-[#0ea5e9]">4.</span> Exportação e Importação
                        </h3>
                        <p>
                          Como as alterações são perdidas caso a página seja recarregada (ambiente local), sempre utilize os botões <strong>Importar Projeto</strong> e <strong>Exportar Projeto</strong> no canto inferior esquerdo para salvar seu progresso no seu computador através de um arquivo <code className="bg-[#222222] px-1.5 py-0.5 rounded text-[#519aba]">.json</code>.
                        </p>
                      </section>

                    </div>
                  </div>
                </div>
              )}

            </SandpackLayout>
          </SandpackProvider>
        </div>
      </main>
    </div>
  );
}
