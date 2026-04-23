"use client"

import {useState,useEffect} from "react"
import api from "@/lib/api"
import {GeneratedImage} from "@/types/image"
import {useRouter} from "next/navigation"

export default function Dashboard(){

const router = useRouter()
const [prompt,setPrompt]=useState("")
const [image,setImage]=useState("")
const [history,setHistory]=useState<GeneratedImage[]>([])
const [activeChat,setActiveChat]=useState("")
const [showSettings, setShowSettings] = useState(false)
const [username, setUsername] = useState("Alex Rivera")
const [profilePic, setProfilePic] = useState("")
const [theme, setTheme] = useState("dark")
const [hideHistory, setHideHistory] = useState(false)

const generate = async ()=>{
if (!prompt.trim()) return;
const res = await api.post("/image/generate",{prompt})
setImage("http://127.0.0.1:8000"+res.data.image_url)
setActiveChat(prompt)
loadHistory()
}

const loadHistory = async ()=>{
const res = await api.get("/image/history")
setHistory(res.data)
}

const like = async()=>{
  if (image && activeChat) {
    // Find the current image in history and like it
    const currentImage = history.find(img => img.prompt === activeChat)
    if (currentImage) {
      await api.post(`/image/like/${currentImage._id}`)
      loadHistory()
    }
  }
}

const dislike = async()=>{
  if (image && activeChat) {
    // Find the current image in history and dislike it
    const currentImage = history.find(img => img.prompt === activeChat)
    if (currentImage) {
      await api.post(`/image/dislike/${currentImage._id}`)
      loadHistory()
    }
  }
}

const copyPrompt = () => {
  if (prompt) {
    navigator.clipboard.writeText(prompt)
    alert('Prompt copied to clipboard!')
  }
}

const downloadImage = () => {
  if (image) {
    const link = document.createElement('a')
    link.href = image
    link.download = 'generated-image.png'
    link.click()
  }
}

const handleNewChat = () => {
  setActiveChat("")
  setImage("")
  setPrompt("")
  // Clear any current generation state
}

const handleChatSelect = (chatTitle: string, imageUrl: string) => {
  setActiveChat(chatTitle)
  setImage("http://127.0.0.1:8000" + imageUrl)
}

const handleSettings = () => {
  setShowSettings(true)
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

useEffect(()=>{
loadHistory()
},[])

// Apply theme changes
useEffect(() => {
  const root = document.documentElement;
  if (theme === 'light') {
    root.style.setProperty('--bg-primary', '#f5f5f5');
    root.style.setProperty('--bg-secondary', '#ffffff');
    root.style.setProperty('--bg-sidebar', '#ffffff');
    root.style.setProperty('--text-primary', '#333333');
    root.style.setProperty('--text-secondary', '#666666');
    root.style.setProperty('--border-color', '#e0e0e0');
  } else {
    root.style.setProperty('--bg-primary', '#1A1412');
    root.style.setProperty('--bg-secondary', '#2C221E');
    root.style.setProperty('--bg-sidebar', '#1A1412');
    root.style.setProperty('--text-primary', '#ffffff');
    root.style.setProperty('--text-secondary', '#A0A0A0');
    root.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.1)');
  }
}, [theme])

return (
<div style={{ display: 'flex', height: '100vh', background: 'var(--bg-primary)' }}>
  {/* Sidebar */}
  <div style={{
    width: '280px',
    height: '100vh',
    background: 'var(--bg-sidebar)',
    borderRight: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px'
  }}>
    {/* Logo */}
    <div style={{
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#FF5722',
      marginBottom: '30px',
      textAlign: 'center'
    }}>
      AI -Image Generator
    </div>

    {/* New Chat Button */}
    <button
      onClick={handleNewChat}
      style={{
        width: '100%',
        padding: '12px 16px',
        background: '#FF5722',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '30px'
      }}
    >
      <span style={{ fontSize: '18px' }}>+</span>
      New Chat
    </button>

    {/* Recent Generations */}
    {!hideHistory && (
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{
          color: 'var(--text-secondary)',
          fontSize: '12px',
          fontWeight: 'bold',
          marginBottom: '15px',
          textTransform: 'uppercase'
        }}>
          Recent Generations
        </div>
        
        {history.map((chat) => (
          <div
            key={chat._id}
            onClick={() => handleChatSelect(chat.prompt, chat.image_url)}
            style={{
              padding: '10px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              background: chat.prompt === activeChat ? '#FF5722' : 'transparent',
              color: chat.prompt === activeChat ? 'white' : 'var(--text-secondary)',
              marginBottom: '5px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => {
              if (chat.prompt !== activeChat) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 87, 34, 0.1)'
              }
            }}
            onMouseOut={(e) => {
              if (chat.prompt !== activeChat) {
                e.currentTarget.style.backgroundColor = 'transparent'
              }
            }}
          >
            <span style={{ fontSize: '14px' }}>📷</span>
            <span style={{ fontSize: '13px' }}>{chat.prompt.substring(0, 20)}...</span>
          </div>
        ))}
      </div>
    )}

    {hideHistory && (
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'var(--text-secondary)',
        fontSize: '14px',
        textAlign: 'center'
      }}>
        History is hidden
      </div>
    )}

    {/* Bottom Navigation */}
    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
      <div style={{
        padding: '10px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        color: 'var(--text-secondary)',
        marginBottom: '5px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        transition: 'background-color 0.2s'
      }}
      onClick={handleSettings}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent'
      }}
      >
        <span style={{ fontSize: '14px' }}>⚙️</span>
        <span style={{ fontSize: '13px' }}>Settings</span>
      </div>
      
      <div style={{
        padding: '10px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        color: 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        transition: 'background-color 0.2s'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent'
      }}
      >
        <span style={{ fontSize: '14px' }}>📚</span>
        <span style={{ fontSize: '13px' }}>Documentation</span>
      </div>
    </div>
  </div>

  {/* Main Content */}
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
    {/* Top Bar */}
    <div style={{
      height: '60px',
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Model:</span>
        <button style={{
          padding: '6px 12px',
          background: 'transparent',
          border: '1px solid #FF5722',
          borderRadius: '6px',
          color: '#FF5722',
          fontSize: '12px',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          ⚡ V-GEN 4.0 TURBO
        </button>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
      }}>
        <div style={{ textAlign: 'right' }}>
          {/* <div style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 'bold' }}>{username}</div> */}
          {/* <div style={{
            background: '#FF5722',
            color: 'white',
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '4px',
            display: 'inline-block'
          }}>Pro Plan</div> */}
        </div>
        {/* <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: '#666',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '12px',
          overflow: 'hidden'
        }}>
          {profilePic ? (
            <img src={profilePic} alt="Profile" style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }} />
          ) : (
            username.split(' ').map(n => n[0]).join('').toUpperCase()
          )}
        </div> */}
        {/* <span style={{
          color: 'var(--text-secondary)',
          fontSize: '12px',
          cursor: 'pointer'
        }} onClick={logout}>Logout →</span> */}
      </div>
    </div>

    {/* Main Content */}
    <div style={{
      flex: 1,
      background: 'var(--bg-secondary)',
      padding: '20px',
      overflowY: 'auto'
    }}>
      {activeChat && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            background: '#FF5722',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '12px',
            maxWidth: '70%',
            marginBottom: '20px'
          }}>
            {activeChat}
          </div>
          
          <div style={{
            display: 'flex',
            gap: '15px',
            marginBottom: '20px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#FF5722',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>✦</div>
            
            <div style={{ flex: 1 }}>
              {image && (
                <div style={{
                  background: '#3E2E27',
                  borderRadius: '12px',
                  padding: '15px',
                  marginBottom: '15px'
                }}>
                  <img 
                    src={image} 
                    alt="Generated" 
                    style={{
                      width: '100%',
                      maxWidth: '400px',
                      borderRadius: '8px',
                      marginBottom: '15px'
                    }}
                  />
                  
                  <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '10px'
                  }}>
                    <button 
                      onClick={like}
                      style={{
                        padding: '6px 12px',
                        background: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '6px',
                        color: '#A0A0A0',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      👍 Like
                    </button>
                    <button 
                      onClick={dislike}
                      style={{
                        padding: '6px 12px',
                        background: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '6px',
                        color: '#A0A0A0',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      👎 Dislike
                    </button>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    gap: '10px'
                  }}>
                    <button 
                      onClick={copyPrompt}
                      style={{
                        padding: '6px 12px',
                        background: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '6px',
                        color: '#A0A0A0',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      📋 Copy
                    </button>
                    <button 
                      onClick={downloadImage}
                      style={{
                        padding: '6px 12px',
                        background: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '6px',
                        color: '#A0A0A0',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      ⬇️ Download
                    </button>
                  </div>
                  
                  <div style={{
                    color: '#A0A0A0',
                    fontSize: '11px',
                    marginTop: '10px'
                  }}>
                    Generated in 4.2s using V-GEN 4.0
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!activeChat && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          {/* <h2 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>Generate Image</h2> */}
          <div>
            {/* <textarea
              value={prompt}
              placeholder="Enter a prompt to generate something magical..."
              onChange={(e)=>setPrompt(e.target.value)}
              style={{width: '100%', height: '100px', marginBottom: '10px', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px'}}
            /> */}
            {/* <button 
              onClick={generate}
              style={{padding: '10px 20px', backgroundColor: '#FF5722', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}
            >
              Generate
            </button> */}
          </div>
        </div>
      )}

      {image && !activeChat && (
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>Generated Image</h3>
          <div style={{
            display: 'inline-block',
            position: 'relative'
          }}>
            <img src={image} style={{
              maxWidth: '400px',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
            }}/>
            <div style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              display: 'flex',
              gap: '5px'
            }}>
              <button
                style={{
                  width: '36px',
                  height: '36px',
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: 'none',
                  borderRadius: '50%',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px'
                }}
                onClick={() => navigator.clipboard.writeText(prompt)}
              >
                📋
              </button>
              <button
                style={{
                  width: '36px',
                  height: '36px',
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: 'none',
                  borderRadius: '50%',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px'
                }}
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = image;
                  link.download = 'generated-image.png';
                  link.click();
                }}
              >
                ⬇️
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* Prompt Input Area */}
    <div style={{
      background: '#2C221E',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '20px'
    }}>
      <div style={{
        background: '#3E2E27',
        borderRadius: '12px',
        padding: '15px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <span style={{ color: '#A0A0A0', fontSize: '18px' }}>📎</span>
        <textarea
          value={prompt}
          placeholder="Enter a prompt to generate something magical..."
          onChange={(e)=>setPrompt(e.target.value)}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '14px',
            outline: 'none',
            padding: '10px'
          }}
        />
        <button
          onClick={generate}
          style={{
            width: '40px',
            height: '40px',
            background: '#FF5722',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}
        >
          ▶
        </button>
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '10px',
        color: 'var(--text-secondary)',
        fontSize: '11px'
      }}>
        <span>Prompts are processed by V-GEN AI</span>
        <span>1,420 credits remaining</span>
      </div>
    </div>
  </div>

  {/* Settings Modal */}
  {showSettings && (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'var(--bg-sidebar)',
        borderRadius: '12px',
        padding: '30px',
        width: '400px',
        maxHeight: '80vh',
        overflowY: 'auto',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '25px'
        }}>
          <h2 style={{
            color: 'white',
            fontSize: '20px',
            fontWeight: 'bold',
            margin: 0
          }}>Settings</h2>
          <button
            onClick={() => setShowSettings(false)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#A0A0A0',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0'
            }}
          >
            ×
          </button>
        </div>

        {/* Profile Section */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{
            color: '#FF5722',
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '15px',
            textTransform: 'uppercase'
          }}>Profile</h3>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '15px'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#666',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px',
              fontWeight: 'bold',
              position: 'relative',
              cursor: 'pointer'
            }}>
              {profilePic ? (
                <img src={profilePic} alt="Profile" style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }} />
              ) : (
                username.split(' ').map(n => n[0]).join('').toUpperCase()
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => setProfilePic(e.target?.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer'
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#2C221E',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* Settings Options */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{
            color: '#FF5722',
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '15px',
            textTransform: 'uppercase'
          }}>Settings</h3>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}>
            {/* Hide History */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 15px',
              background: '#2C221E',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '16px' }}>👁️</span>
                <span style={{ color: 'white', fontSize: '14px' }}>Hide History</span>
              </div>
              <button
                onClick={() => setHideHistory(!hideHistory)}
                style={{
                  width: '50px',
                  height: '26px',
                  background: hideHistory ? '#FF5722' : '#666',
                  border: 'none',
                  borderRadius: '13px',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                <div style={{
                  width: '22px',
                  height: '22px',
                  background: 'white',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '2px',
                  left: hideHistory ? '26px' : '2px',
                  transition: 'left 0.2s'
                }} />
              </button>
            </div>

            {/* Theme */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 15px',
              background: '#2C221E',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '16px' }}>🌙</span>
                <span style={{ color: 'white', fontSize: '14px' }}>Theme</span>
              </div>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                style={{
                  padding: '6px 12px',
                  background: '#1A1412',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>

            {/* Logout */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 15px',
              background: '#2C221E',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '16px' }}>🚪</span>
                <span style={{ color: 'white', fontSize: '14px' }}>Logout</span>
              </div>
              <button
                onClick={() => {
                  logout()
                  setShowSettings(false)
                }}
                style={{
                  padding: '6px 12px',
                  background: 'transparent',
                  border: '1px solid #FF5722',
                  borderRadius: '6px',
                  color: '#FF5722',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 87, 34, 0.1)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}
</div>
)
}
