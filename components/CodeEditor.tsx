
import React, { useState, useRef } from 'react';
import { Play, Save, Terminal, FileCode, Plus, FileText, Trash2, Upload } from 'lucide-react';
import { runFashionScript } from '../services/gemini';
import { ScriptFile } from '../types';

const INITIAL_FILES: ScriptFile[] = [
    {
        id: '1',
        name: 'config.yaml',
        language: 'yaml',
        content: `# Styllen Configuration Script
# Define Outfit Parameters for AI Generation

occasion: "cocktail_party"
season: "winter"
preferences:
  style: "minimalist_chic"
  colors: ["black", "silver"]
  materials: ["silk", "velvet"]
user_profile:
  height: "175cm"
  body_type: "athletic"

# Request
generate_outfit_plan()`
    },
    {
        id: '2',
        name: 'styles.json',
        language: 'json',
        content: `{
  "trending_colors": ["Viva Magenta", "Electric Blue"],
  "fabric_weights": {
     "summer": "120gsm",
     "winter": "400gsm"
  }
}`
    }
];

const CodeEditor: React.FC = () => {
  const [files, setFiles] = useState<ScriptFile[]>(INITIAL_FILES);
  const [activeFileId, setActiveFileId] = useState<string>(INITIAL_FILES[0].id);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeFile = files.find(f => f.id === activeFileId) || files[0];

  const handleCodeChange = (newContent: string) => {
    setFiles(files.map(f => f.id === activeFileId ? { ...f, content: newContent } : f));
  };

  const handleAddFile = () => {
      const newFile: ScriptFile = {
          id: Date.now().toString(),
          name: `script_${files.length + 1}.py`,
          language: 'python',
          content: '# New Fashion Script\n'
      };
      setFiles([...files, newFile]);
      setActiveFileId(newFile.id);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            const content = ev.target?.result as string;
            const newFile: ScriptFile = {
                id: Date.now().toString(),
                name: file.name,
                language: 'javascript', // default language
                content: content
            };
            setFiles([...files, newFile]);
            setActiveFileId(newFile.id);
        };
        reader.readAsText(file);
    }
  };

  const handleDeleteFile = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (files.length > 1) {
          const newFiles = files.filter(f => f.id !== id);
          setFiles(newFiles);
          if (activeFileId === id) {
              setActiveFileId(newFiles[0].id);
          }
      }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput(`> Executing ${activeFile.name}...\n`);
    
    // Simulate processing time
    await new Promise(r => setTimeout(r, 500));

    const result = await runFashionScript(activeFile.content);
    
    setOutput(prev => prev + '\n' + result + '\n> Done.');
    setIsRunning(false);
  };

  return (
    <div className="h-full flex flex-col space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
            <Terminal className="text-slate-700" />
            Fashion Shell
          </h2>
          <p className="text-slate-500 text-sm">Advanced configuration & logic scripting.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono flex items-center gap-2 transition-colors text-slate-700 shadow-sm">
            <Save size={16} />
            Save Project
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono flex items-center gap-2 transition-colors text-slate-700 shadow-sm"
          >
            <Upload size={16} />
            Import
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileUpload}
            accept=".json,.yaml,.yml,.py,.js,.txt"
          />
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-mono flex items-center gap-2 transition-colors disabled:opacity-50 shadow-md"
          >
            <Play size={16} />
            {isRunning ? 'Running...' : 'Run Script'}
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-[500px] rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-[#0d0d0d]">
        {/* File Sidebar - Dark Theme maintained for editor aesthetic */}
        <div className="bg-[#151517] border-r border-white/5 flex flex-col overflow-hidden lg:col-span-1">
            <div className="bg-[#1a1a1d] px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Explorer</span>
                <button onClick={handleAddFile} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">
                    <Plus size={14} />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {files.map(file => (
                    <div 
                        key={file.id}
                        onClick={() => setActiveFileId(file.id)}
                        className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${activeFileId === file.id ? 'bg-purple-900/30 text-purple-200' : 'text-gray-400 hover:bg-white/5'}`}
                    >
                        <div className="flex items-center gap-2 overflow-hidden">
                            <FileCode size={14} className={activeFileId === file.id ? 'text-purple-400' : 'text-gray-600'} />
                            <span className="truncate">{file.name}</span>
                        </div>
                        <button 
                            onClick={(e) => handleDeleteFile(file.id, e)}
                            className={`opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity ${files.length === 1 ? 'hidden' : ''}`}
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                ))}
            </div>
        </div>

        {/* Editor Area */}
        <div className="bg-[#0d0d0d] flex flex-col overflow-hidden font-mono text-sm lg:col-span-2 border-r border-white/5">
          <div className="bg-[#1a1a1d] px-4 py-2 border-b border-white/5 flex items-center gap-2 text-gray-400 text-xs">
            <FileText size={14} />
            <span>{activeFile.name}</span>
          </div>
          <textarea
            value={activeFile.content}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="flex-1 bg-transparent p-4 resize-none focus:outline-none text-gray-300 leading-relaxed custom-scrollbar font-mono"
            spellCheck={false}
          />
        </div>

        {/* Terminal Output */}
        <div className="bg-[#0d0d0d] flex flex-col overflow-hidden font-mono text-sm lg:col-span-1">
          <div className="bg-[#1a1a1d] px-4 py-2 border-b border-white/5 flex items-center gap-2 text-gray-400 text-xs">
            <Terminal size={14} />
            <span>Console</span>
          </div>
          <div className="flex-1 p-4 overflow-y-auto text-green-400 whitespace-pre-wrap custom-scrollbar">
            <span className="opacity-50">root@styllen:~$</span> {output}
            {isRunning && <span className="animate-pulse">_</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;