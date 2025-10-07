import { useState } from 'react';
import { FileUploadZone, UploadedFile } from '@/components/FileUploadZone';
import { ChatInterface, Message } from '@/components/ChatInterface';
import { OfflineBanner, OnlineStatus } from '@/components/OfflineBanner';
import { DemoChatbot } from '@/components/DemoChatbot';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { FileText, Upload, MessageSquare, FolderOpen, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesUploaded = (newFiles: UploadedFile[]) => {
    setUploadedFiles((prev) => {
      const existingIds = new Set(prev.map(f => f.id));
      const uniqueNewFiles = newFiles.filter(f => !existingIds.has(f.id));
      return [...prev, ...uniqueNewFiles];
    });
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter(f => f.id !== id));
  };

  const generateMockRAGResponse = (query: string, files: UploadedFile[]) => {
    if (files.length === 0) {
      return {
        answer: "I don't have any documents to search through yet. Please upload some files first!",
        ragResult: undefined,
      };
    }

    const randomFile = files[Math.floor(Math.random() * files.length)];
    const mockSnippets = [
      "This document contains relevant information about the topic...",
      "According to the file, the key points include...",
      "The document discusses several aspects of this subject...",
      "Based on the content, we can see that...",
      "The file provides detailed information regarding...",
    ];

    const mockAnswers = [
      `Based on my analysis of your documents, ${query.toLowerCase().includes('what') ? 'the answer is' : 'I found that'} this information is relevant to your query.`,
      `I searched through your uploaded files and found that ${randomFile.name} contains the most relevant information about this topic.`,
      `According to the documents you've uploaded, particularly in ${randomFile.name}, there are several key points worth noting.`,
      `My search through your files indicates that this is addressed in ${randomFile.name}.`,
    ];

    return {
      answer: mockAnswers[Math.floor(Math.random() * mockAnswers.length)],
      ragResult: {
        snippet: mockSnippets[Math.floor(Math.random() * mockSnippets.length)],
        fileName: randomFile.name,
        score: 0.75 + Math.random() * 0.24, // Random score between 0.75 and 0.99
      },
    };
  };

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    // Simulate processing delay
    setTimeout(() => {
      const { answer, ragResult } = generateMockRAGResponse(content, uploadedFiles);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: answer,
        timestamp: new Date(),
        ragResult,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsProcessing(false);
    }, 1000 + Math.random() * 1000);
  };

  return (
    <>
      <OfflineBanner />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary text-primary-foreground">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Sankalan</h1>
                <p className="text-sm text-muted-foreground">Offline-Ready Document Q&A</p>
              </div>
            </div>
            <OnlineStatus />
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Upload</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Ask Questions</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Documents</span>
              </TabsTrigger>
              <TabsTrigger value="demo" className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                <span className="hidden sm:inline">Demo Bot</span>
              </TabsTrigger>
            </TabsList>

            {/* Upload Tab */}
            <TabsContent value="upload" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Upload Documents</h2>
                <FileUploadZone
                  onFilesUploaded={handleFilesUploaded}
                  uploadedFiles={uploadedFiles}
                  onRemoveFile={handleRemoveFile}
                />
              </Card>

              {uploadedFiles.length > 0 && (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-foreground">Indexing Status</h3>
                    <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                      Ready
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {uploadedFiles.length} document{uploadedFiles.length !== 1 ? 's' : ''} indexed and ready for querying
                  </p>
                </Card>
              )}
            </TabsContent>

            {/* Ask Questions Tab */}
            <TabsContent value="chat">
              <Card className="overflow-hidden flex flex-col" style={{ height: '600px' }}>
                <div className="px-6 py-4 border-b border-border">
                  <h2 className="text-lg font-semibold text-foreground">Ask Questions</h2>
                  <p className="text-sm text-muted-foreground">Query your documents using natural language</p>
                </div>
                <ChatInterface
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isProcessing={isProcessing}
                />
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents">
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Stored Documents</h2>
                {uploadedFiles.length === 0 ? (
                  <div className="text-center py-12">
                    <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground mb-2">No documents uploaded yet</p>
                    <p className="text-sm text-muted-foreground">Upload files to see them here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024).toFixed(2)} KB • {file.type || 'Unknown type'}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFile(file.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* Demo Bot Tab */}
            <TabsContent value="demo">
              <Card className="overflow-hidden flex flex-col" style={{ height: '600px' }}>
                <div className="px-6 py-4 border-b border-border">
                  <h2 className="text-lg font-semibold text-foreground">Demo Chatbot</h2>
                  <p className="text-sm text-muted-foreground">Try out the chat interface with a simulated bot</p>
                </div>
                <DemoChatbot />
              </Card>
            </TabsContent>
          </Tabs>

          {/* Info Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              This is a simulated RAG system. All responses are generated locally without external API calls.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
