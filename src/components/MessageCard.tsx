'use client';

import React, { useRef, useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { X, Share2, Eye, EyeOff, AlertTriangle, Palette, Check, ShieldAlert } from 'lucide-react';
import { Message } from '@/model/User.model';
import { Card, CardHeader } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { ApiResponse } from '@/types/ApiResponse';
import { Badge } from '@/components/ui/badge';
import * as htmlToImage from 'html-to-image';
import { themes, renderPattern, ThemeKey } from '@/lib/themes';

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const viralRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  
 
  const [isRevealed, setIsRevealed] = useState(!message.isBlurred);
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>('ocean');
  const [showThemePicker, setShowThemePicker] = useState(false);

  
  useEffect(() => {
    if (!showThemePicker) return;
    
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowThemePicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showThemePicker]);

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id as string}`
      );
      toast.success(response.data.message);
      onMessageDelete(message._id as string);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? 'Failed to delete message');
    }
  };

  const handleShare = async () => {
    if (message.isHidden || (message.isBlurred && !isRevealed)) {
      toast.error("Cannot share hidden or sensitive content.");
      return;
    }

    if (!viralRef.current) {
      toast.error("Share element not found.");
      return;
    }

    setIsCapturing(true);
    setShowThemePicker(false); 

    try {
      const element = viralRef.current;
      element.style.left = "0";
      element.style.top = "0";
      element.style.opacity = "1";
      element.style.zIndex = "9999";
      
      await new Promise(resolve => requestAnimationFrame(resolve));
      await new Promise(resolve => requestAnimationFrame(resolve));
      await document.fonts.ready;
      await new Promise(resolve => setTimeout(resolve, 500)); 
      
      const dataUrl = await htmlToImage.toPng(element, {
        quality: 1.0,
        pixelRatio: 2,
        cacheBust: true,
      });
      
      element.style.left = "-9999px";
      element.style.opacity = "0";
      element.style.zIndex = "-1";

      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], 'Whisper-Box.png', { type: 'image/png' });

      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Whisper Box',
          text: 'Check out this anonymous message I got!',
        });
      } else {
        const link = document.createElement('a');
        link.download = `whisper-box-${message._id}.png`;
        link.href = dataUrl;
        link.click();
        toast.success('Image downloaded!');
      }
    } catch (err) {
      console.error('Share error:', err);
      toast.error('Failed to create image.');
    } finally {
      setIsCapturing(false);
    }
  };

  // --- RENDER: HIDDEN MESSAGE ---
  if (message.isHidden) {
    return (
      <Card className="card-bordered bg-muted/20 border-red-500/20 opacity-80">
        <CardHeader>
           <div className="flex justify-between items-center">
             <div className="flex items-center gap-3 text-destructive">
               <ShieldAlert className="h-5 w-5" />
               <div className="flex flex-col">
                 <span className="font-semibold text-sm">Highly Sensitive Content</span>
                 <span className="text-xs text-muted-foreground italic">Filtered for safety</span>
               </div>
             </div>
             <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Delete hidden message"
                >
                  <X className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete hidden message?</AlertDialogTitle>
                  <AlertDialogDescription>Permanently remove this filtered message?</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
             </AlertDialog>
           </div>
        </CardHeader>
      </Card>
    );
  }

  // --- RENDER: NORMAL/WARNED/BLURRED MESSAGES ---
  return (
    <>
      <Card className={`
        group relative overflow-visible transition-all duration-300
        hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10
        ${message.isWarned 
          ? 'border-yellow-500/50 bg-yellow-50/5 dark:bg-yellow-950/10' 
          : 'border-border hover:border-primary/20'
        }
      `}>
        
        {/* Theme Picker */}
        <div className="absolute top-3 right-3 z-40" ref={pickerRef}>
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              setShowThemePicker(!showThemePicker);
            }}
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 relative"
            aria-label="Select theme"
          >
            <Palette className="h-4 w-4" />
            <span 
              className="absolute top-1 right-1 w-2 h-2 rounded-full border border-white dark:border-gray-900 shadow-sm"
              style={{ background: themes[currentTheme].gradient }}
              aria-hidden="true"
            />
          </Button>

          {showThemePicker && (
            <div className="absolute right-0 top-9 z-50 w-64 p-3 bg-card border border-border rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-2 px-1 text-xs font-semibold text-muted-foreground">
                <span>Select Theme</span>
              </div>
              <div className="grid grid-cols-4 gap-2 max-h-[200px] overflow-y-auto p-1">
                {Object.entries(themes).map(([key, t]) => (
                  <button
                    key={key}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentTheme(key as ThemeKey);
                    }}
                    aria-label={`Select ${key} theme`}
                    className={`
                      relative w-12 h-12 rounded-lg overflow-hidden transition-all
                      ${currentTheme === key ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'hover:ring-2 hover:ring-muted-foreground/50'}
                    `}
                  >
                    <div className="absolute inset-0" style={{ background: t.gradient }} />
                    <span className="absolute inset-0 flex items-center justify-center text-lg">
                      {t.emoji}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <CardHeader className="pb-4 space-y-4 pt-10">
          
          {/* Warning Badge for Spam */}
          {message.isWarned && (
            <div className="flex items-center text-xs font-medium text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 p-2 px-3 rounded-lg w-fit border border-yellow-200 dark:border-yellow-800">
              <AlertTriangle className="h-3.5 w-3.5 mr-1.5 flex-shrink-0"/>
              <span>Flagged as potential spam</span>
            </div>
          )}

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0 space-y-3">
              <div className="relative">
                
                <div 
                  className={`
                    group/message rounded-xl p-4 transition-all duration-300
                    ${message.isBlurred && !isRevealed
                      ? 'blur-md select-none cursor-pointer bg-muted/20 hover:bg-muted/30' 
                      : 'bg-muted/20 hover:bg-muted/30'
                    }
                  `}
                  onClick={() => {
                    if (message.isBlurred) {
                      setIsRevealed((prev) => !prev);
                    }
                  }}
                 
                  role={message.isBlurred ? "button" : undefined}
                  tabIndex={message.isBlurred ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (message.isBlurred && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      setIsRevealed((prev) => !prev);
                    }
                  }}
                  aria-label={message.isBlurred ? (isRevealed ? "Click to blur content" : "Click to reveal content") : undefined}
                >
                  <p className="text-base font-medium leading-relaxed text-foreground" 
                     style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                    {message.content}
                  </p>
                </div>
                
                
                {message.isBlurred && !isRevealed && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    <Badge className="shadow-xl backdrop-blur-md px-5 py-2.5 bg-background/95 border-2 border-primary/50">
                      <Eye className="h-4 w-4 mr-2 text-primary animate-pulse"/> 
                      <span className="font-semibold text-sm text-primary">Click to reveal</span>
                    </Badge>
                  </div>
                )}

              
                {message.isBlurred && isRevealed && (
                  <div className="absolute top-2 right-2 z-20">
                    <Badge 
                      variant="outline" 
                      className="text-xs cursor-pointer hover:bg-muted/80 transition-colors bg-background/80 backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsRevealed(false);
                      }}
                    >
                      <EyeOff className="h-3 w-3 mr-1"/> 
                      <span>Blur again</span>
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
                <span>{dayjs(message.createdAt).format('MMM D, YYYY')} • {dayjs(message.createdAt).format('h:mm A')}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-1">
              <Button 
                onClick={handleShare} 
                variant="outline" 
                size="icon" 
                disabled={(message.isBlurred && !isRevealed) || isCapturing}
                aria-label="Share message"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="Delete message">
                    <X className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                   <AlertDialogHeader>
                    <AlertDialogTitle>Delete this message?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. The message will be permanently removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteConfirm} 
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
      </Card>

       {/* Your Original Off-screen Share Element Logic */}
    <div 
  ref={viralRef} 
  style={{ 
    position: "absolute", 
    left: "-9999px", 
    top: "0", 
    pointerEvents: "none" 
  }}
>
  <div style={{ 
    width: "600px", 
    height: "600px", 
    background: themes[currentTheme].gradient, 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    justifyContent: "space-between", 
    padding: "50px 40px", // More balanced padding
    position: "relative",
    overflow: "hidden",
    boxSizing: "border-box"
  }}>
    
    {/* 1. Background Pattern Layer */}
    <div style={{ 
      position: "absolute", 
      inset: 0, 
      zIndex: 0,
      opacity: 0.6 // Softens the pattern for better text contrast
    }}>
      {renderPattern(themes[currentTheme].pattern)}
    </div>

    {/* 2. Top Header (Visual Polish) */}
    <div style={{ 
      zIndex: 10, 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      gap: "8px" 
    }}>
      <div style={{ 
        fontSize: "64px", 
        filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.2))",
        marginBottom: "4px"
      }}>
        {themes[currentTheme].emoji}
      </div>
      <div style={{
        color: "rgba(255,255,255,0.8)",
        fontSize: "14px",
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: "3px",
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}>
      </div>
    </div>

    {/* 3. Middle Section (The Content Card) */}
    <div style={{ 
      flex: 1, 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      width: "100%",
      zIndex: 10,
      padding: "20px 0"
    }}>
      <div style={{ 
        fontSize: message.content.length > 100 ? "32px" : "40px", // Dynamic sizing
        fontWeight: "800", 
        color: "#ffffff", 
        textAlign: "center", 
        fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        lineHeight: "1.25",
        textShadow: "0 2px 15px rgba(0,0,0,0.25)",
        wordBreak: "break-word",
        maxWidth: "90%",
        fontStyle: "italic"
      }}>
        <span style={{ 
          fontSize: "60px", 
          opacity: 0.4, 
          display: "block", 
          lineHeight: 0, 
          marginBottom: "18px" 
        }}>“</span>
        {message.content}
        <span style={{ 
          fontSize: "60px", 
          opacity: 0.4, 
          display: "block", 
          lineHeight: 0, 
          marginTop: "33px" 
        }}>”</span>
      </div>
    </div>

    {/* 4. Bottom Branding Section */}
    <div style={{ 
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "15px",
      zIndex: 10,
      width: "100%"
    }}>
      <div style={{ 
        backgroundColor: "rgba(0,0,0,0.8)", 
        color: "#ffffff", 
        padding: "14px 28px", 
        borderRadius: "100px",
        fontSize: "15px",
        fontWeight: "700",
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        border: "1px solid rgba(255,255,255,0.15)",
        backdropFilter: "blur(8px)", // Gives a high-end glass effect
        letterSpacing: "0.2px",
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}>
        <span>Tap to reply on</span>
        <span style={{ 
          color: "#4ECDC4", 
          fontWeight: "800"
        }}>Whisper Box</span>
      </div>
      
      {/* Subtle URL placeholder */}
      <div style={{
        color: "rgba(255,255,255,0.5)",
        fontSize: "12px",
        fontWeight: "500",
        letterSpacing: "1px"
      }}>
        whisper-box.xyz
      </div>
    </div>
  </div>
</div>
    </>
  );
}