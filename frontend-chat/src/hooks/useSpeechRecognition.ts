import { useRef, useState } from 'react';
import { sendAudio } from '../services/api';

export function useSpeechRecognition(
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  setError: (error: string | null) => void
) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [listening, setListening] = useState(false);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');

        try {
          const data = await sendAudio(formData);
          setMessage(prev => prev ? prev + ' ' + data.transcription : data.transcription);
        } catch (err) {
          console.error(err);
          setError('Ошибка при распознавании речи.');
        }
      };

      mediaRecorder.start();
      setListening(true);
    } catch (err) {
      console.error(err);
      setError('Не удалось получить доступ к микрофону.');
    }
  };

  const stopListening = () => {
    mediaRecorderRef.current?.stop();
    setListening(false);
  };

  return { listening, startListening, stopListening };
}