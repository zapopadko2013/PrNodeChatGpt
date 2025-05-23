import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendMessage } from '../services/api';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

import {
  Input,
  Button,
  Card,
  Alert,
  Tooltip,
} from 'antd';

import {
  AudioOutlined,
  LoadingOutlined,
  ArrowRightOutlined,
  MessageOutlined,
} from '@ant-design/icons';

const { TextArea } = Input;

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [history, setHistory] = useState<{ question: string; answer: string; date: Date }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const {
    listening,
    startListening,
    stopListening,
  } = useSpeechRecognition(setMessage, setError);

  const handleSend = async () => {
    if (!message.trim()) {
      setError('Введите сообщение.');
      return;
    }

    setLoading(true);
    try {
      const res = await sendMessage(message);
      if (res?.error) {
        setError(res.error);
        return;
      }

      const answer = res?.reply || '';
      const now = new Date();

      setHistory([...history, { question: message, answer, date: now }]);
      setMessage('');
      setResponse(answer);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Произошла ошибка при отправке сообщения.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0050b3] text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <Tooltip title="История">
          <Button
            type="primary"
            icon={<MessageOutlined />}
            onClick={() => navigate('/history', { state: { history } })}
          />
        </Tooltip>
      </div>

      <div className="p-6 max-w-[800px] mx-auto">
        <h2 className="text-2xl font-bold mb-4">Чат с GPT</h2>

        {error && (
          <Alert
            message="Ошибка"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            className="mb-4 !bg-red-600 !text-white"
          />
        )}

        <div className="relative w-full mb-6">
          <div className="rounded-md overflow-hidden">
            <TextArea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Введите сообщение или используйте микрофон..."
              className="!bg-[#1e6fd9] !text-white !border-white placeholder-white pr-20"
            />
          </div>

          <Button
            type="primary"
            icon={<ArrowRightOutlined />}
            onClick={handleSend}
            disabled={!message.trim() || loading}
            className="absolute right-2 bottom-2 w-9 h-9 p-0 rounded-md flex justify-center items-center z-10"
          />

          <Tooltip title={listening ? 'Остановить запись' : 'Говорите'}>
            <Button
              type={listening ? 'default' : 'primary'}
              icon={listening ? <LoadingOutlined /> : <AudioOutlined />}
              onClick={listening ? stopListening : startListening}
              className="absolute left-2 bottom-2 w-9 h-9 p-0 rounded-md bg-[#1e6fd9] text-white z-10"
            />
          </Tooltip>
        </div>

        <hr className="border-white my-4" />

        <div className="flex flex-col gap-4">
          {history.map((entry, index) => (
            <Card
              key={index}
              className="!bg-[#1e6fd9] !border-white !text-white"
            >
              <div>
                <strong className="text-white">
                  Вы ({entry.date.toLocaleString()}):
                </strong>
                <p className="whitespace-pre-wrap">{entry.question}</p>
              </div>
              <hr className="my-2 border-white" />
              <div>
                <span className="text-[#cce6ff]">
                  GPT ({entry.date.toLocaleString()}):
                </span>
                <p className="whitespace-pre-wrap bg-[#1570b8] text-white p-3 rounded-md mt-1">
                  {entry.answer}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}