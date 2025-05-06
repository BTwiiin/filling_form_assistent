"use client"

import { useState } from "react"
import { Send, Bot, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormPreview } from "../components/form-preview"
import { ChatMessage } from "../components/chat-message"
import { useChat } from "../hooks/use-chat"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("chat")
  const { messages, input, setInput, handleSubmit, formData, isLoading, resetChat } = useChat()

  const completionPercentage = Object.values(formData).filter(Boolean).length * 20

  return (
    <main className="flex min-h-screen flex-col">
      <header className="border-b bg-background py-4 px-6 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">AI Helpdesk Assistant</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={resetChat} className="gap-2 hover:cursor-pointer">
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 gap-4">
        <div className="md:w-3/5 flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm font-normal">
                AI Powered
              </Badge>
              <Badge variant="secondary" className="text-sm font-normal">
                Form Completion: {completionPercentage}%
              </Badge>
            </div>
          </div>

          <div className="md:hidden mb-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="form">Form Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="chat" className="mt-2">
                <Card className="h-[500px] flex flex-col">
                  <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
                        <Bot className="h-12 w-12 mb-4 text-primary/20" />
                        <h3 className="text-lg font-medium">Welcome to AI Helpdesk</h3>
                        <p className="text-sm mt-2">
                          I'll help you fill out your helpdesk request. Just start chatting with me!
                        </p>
                      </div>
                    ) : (
                      messages.map((message, index) => <ChatMessage key={index} message={message} />)
                    )}
                  </CardContent>
                  <div className="p-4 border-t">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                        className="flex-1"
                      />
                      <Button type="submit" size="icon" disabled={isLoading} className="hover:cursor-pointer">
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </Card>
              </TabsContent>
              <TabsContent value="form" className="mt-2">
                <FormPreview formData={formData} />
              </TabsContent>
            </Tabs>
          </div>

          <Card className="flex-1 flex flex-col hidden md:flex">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Chat with AI Assistant</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
                  <Bot className="h-12 w-12 mb-4 text-primary/20" />
                  <h3 className="text-lg font-medium">Welcome to AI Helpdesk</h3>
                  <p className="text-sm mt-2">
                    I'll help you fill out your helpdesk request. Just start chatting with me!
                  </p>
                </div>
              ) : (
                messages.map((message, index) => <ChatMessage key={index} message={message} />)
              )}
            </CardContent>
            <div className="p-4 border-t">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={isLoading}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </Card>
        </div>

        <div className="md:w-2/5 hidden md:block">
          <div className="sticky top-24">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Form Preview</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="p-4">
                <div className="mb-4">
                  <Progress value={completionPercentage} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-2">{completionPercentage}% complete</p>
                </div>
                <FormPreview formData={formData} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
