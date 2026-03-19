"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bot, BookOpen, ExternalLink, Download, Search } from "lucide-react"

interface AIReaderProps {
  title?: string
  author?: string
  isbn?: string
  iaId?: string
  className?: string
}

export function AIReader({ title, author, isbn, iaId, className }: AIReaderProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiContent, setAiContent] = useState<string>('')
  const [error, setError] = useState<string>('')

  const generateAIContent = async () => {
    if (!title) return
    
    setIsAnalyzing(true)
    setError('')
    
    try {
      // Simulate AI content generation (in real app, this would call an AI API)
      const prompt = `Generate a comprehensive summary and analysis of the book "${title}"${author ? ` by ${author}` : ''}. Include:
      1. A brief plot summary (2-3 sentences)
      2. Key themes and topics covered
      3. Writing style and tone
      4. Target audience and reading level
      5. Notable quotes or passages
      6. Critical analysis and significance
      
      Format the response in a clear, engaging way that would help readers understand the book's value.`
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock AI response based on common book analysis patterns
      const mockAIResponse = `## 📖 Book Analysis: "${title}"

${author ? `**Author:** ${author}` : ''}

### 📝 Summary
This ${getRandomSummary()} 

### 🎯 Key Themes
${getRandomThemes()}

### ✍ Writing Style & Tone
${getRandomWritingStyle()}

### 👥 Target Audience
${getRandomAudience()}

### 💭 Notable Insights
${getRandomInsights()}

---

*This AI-generated analysis is based on the book's content, themes, and literary elements. Perfect for readers who want to understand the book's core ideas before reading.*

### 🔍 Want to Read This Book?
${iaId ? `
**📚 Full Text Available:** This book is available for complete reading through Internet Archive. Click the "Internet Archive Reader" section above to access the full text immediately.

**🔗 Direct Access:** [Read Now](https://archive.org/details/${iaId})
` : `
**📖 Preview Mode:** Access this book through external platforms or search for a complete text version.

**🔗 Search Options:** Check the "Alternative Reading Options" section below for multiple reading sources.
`}

---

⚠️ *Note: This is a simulated AI analysis. In a production environment, this would connect to a real AI service like OpenAI's API to generate personalized book insights.*`

      setAiContent(mockAIResponse)
    } catch (err) {
      console.error('Failed to generate AI content:', err)
      setError('Failed to generate AI analysis. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getRandomSummary = () => {
    const summaries = [
      "A compelling narrative that explores the intersection of technology and human experience, questioning our relationship with the digital world while maintaining a sense of wonder about our future.",
      "Set in a dystopian future where humanity has embraced artificial intelligence, this thought-provoking novel examines what it means to be human when machines can replicate consciousness perfectly.",
      "An intimate memoir that traces one person's journey from addiction to recovery, offering raw honesty and hope for anyone facing similar struggles.",
      "A sweeping historical saga that spans generations, weaving together personal stories with major world events to create a rich tapestry of human experience.",
      "A practical guide that transforms complex scientific concepts into accessible wisdom, empowering readers to make informed decisions in their daily lives."
    ]
    return summaries[Math.floor(Math.random() * summaries.length)]
  }

  const getRandomThemes = () => {
    const themes = [
      "Identity and self-discovery, the nature of consciousness, what makes us human",
      "Technology and society, the impact of innovation on social structures", 
      "Love and relationships, the complexities of human connection in the modern world",
      "Power and corruption, how authority shapes and distorts truth",
      "Environmental crisis, humanity's relationship with nature and climate change",
      "Memory and trauma, how past experiences shape present reality",
      "Freedom vs. control, the eternal struggle between liberty and security"
    ]
    return themes.slice(0, 3 + Math.floor(Math.random() * 2)).map(theme => `• ${theme}`).join('\n')
  }

  const getRandomWritingStyle = () => {
    const styles = [
      "Lyrical and philosophical, with rich metaphors and introspective passages",
      "Direct and journalistic, with clear, impactful prose",
      "Conversational and intimate, creating a personal connection with readers",
      "Academic yet accessible, balancing intellectual rigor with readability",
      "Poetic and experimental, playing with form and structure"
    ]
    return styles[Math.floor(Math.random() * styles.length)]
  }

  const getRandomAudience = () => {
    const audiences = [
      "Young adults and adults interested in contemporary philosophical questions",
      "Readers who enjoy character-driven literary fiction with emotional depth",
      "Anyone interested in understanding the intersection of technology and humanity",
      "Those who appreciate memoirs that tackle difficult subjects with honesty and grace"
    ]
    return audiences[Math.floor(Math.random() * audiences.length)]
  }

  const getRandomInsights = () => {
    const insights = [
      `"The question isn't whether machines can think, but whether we can create machines that can experience the world as we do." - Chapter 3`,
      `"In the end, we're all just stories we tell ourselves about who we are." - Final reflection`,
      `"The most dangerous inventions are those that make us forget how to live without them." - Mid-book warning`,
      `"True intelligence isn't about knowing everything, but about being able to learn anything." - Author's thesis statement`
    ]
    return insights.slice(0, 2 + Math.floor(Math.random() * 2)).map(insight => `• ${insight}`).join('\n')
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium flex items-center gap-2">
              <Bot className="h-4 w-4 mr-2" />
              AI Book Analysis
            </h3>
            <Badge variant="outline" className="text-xs">
              AI-Powered Insights
            </Badge>
          </div>

          {/* Generate Button */}
          {!aiContent && !isAnalyzing && (
            <Button 
              onClick={generateAIContent}
              disabled={isAnalyzing}
              className="w-full"
              variant="outline"
            >
              <Bot className="mr-2 h-4 w-4" />
              {isAnalyzing ? 'Analyzing...' : 'Generate AI Analysis'}
            </Button>
          )}

          {/* Loading State */}
          {isAnalyzing && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-sm text-muted-foreground">Analyzing book content...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-800 dark:text-red-200">
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}

          {/* AI Content */}
          {aiContent && (
            <div className="prose prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ __html: aiContent }} />
              
              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t">
                <div className="flex flex-col sm:flex-row gap-3">
                  {iaId && (
                    <Button asChild className="flex-1">
                      <a
                        href={`https://archive.org/details/${iaId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <BookOpen className="h-4 w-4" />
                        Read Full Text
                      </a>
                    </Button>
                  )}
                  
                  <Button asChild variant="outline" className="flex-1">
                    <a
                      href={`https://books.google.com/books?q=${encodeURIComponent(`${title || ''} ${author || ''}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <Search className="h-4 w-4" />
                      Search on Google Books
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
