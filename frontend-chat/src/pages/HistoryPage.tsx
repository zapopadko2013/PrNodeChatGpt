import { useEffect, useState } from 'react';
import { Input, Table, Card, Typography } from 'antd';
import { getHistory } from '../services/api';
import type { ColumnsType } from 'antd/es/table';

const { Paragraph } = Typography;

export default function HistoryPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<any[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [questionSearch, setQuestionSearch] = useState('');
  const [answerSearch, setAnswerSearch] = useState('');

  useEffect(() => {
    getHistory().then(data => {
      setMessages(data);
      setFilteredMessages(data);
    });
  }, []);

  useEffect(() => {
    const filtered = messages.filter(
      (msg) =>
        msg.question.toLowerCase().includes(questionSearch.toLowerCase()) &&
        msg.answer.toLowerCase().includes(answerSearch.toLowerCase())
    );
    setFilteredMessages(filtered);
    setSelectedMessage(null);
  }, [questionSearch, answerSearch, messages]);

  const columns: ColumnsType<any> = [
    {
      title: 'Вопрос',
      dataIndex: 'question',
      key: 'question',
      filterDropdown: () => (
        <div className="p-2">
          <Input
            placeholder="Поиск вопроса"
            value={questionSearch}
            onChange={(e) => setQuestionSearch(e.target.value)}
            className="w-52"
            allowClear
          />
        </div>
      ),
      onFilterDropdownVisibleChange: visible => {
        if (!visible) {
          setSelectedMessage(null);
        }
      }
    },
    {
      title: 'Ответ',
      dataIndex: 'answer',
      key: 'answer',
      filterDropdown: () => (
        <div className="p-2">
          <Input
            placeholder="Поиск ответа"
            value={answerSearch}
            onChange={(e) => setAnswerSearch(e.target.value)}
            className="w-52"
            allowClear
          />
        </div>
      ),
      onFilterDropdownVisibleChange: visible => {
        if (!visible) {
          setSelectedMessage(null);
        }
      }
    },
    {
      title: 'Дата',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleString(),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">История сообщений</h1>

      <Table
        dataSource={filteredMessages.map((msg, index) => ({ ...msg, key: index }))}
        columns={columns}
        pagination={{ pageSize: 10 }}
        bordered
        onRow={(record) => ({
          onClick: () => setSelectedMessage(record),
        })}
        rowClassName={(record) =>
          selectedMessage?.key === record.key ? 'ant-table-row-selected' : ''
        }
      />

      {selectedMessage && (
        <Card
          title="Детальный ответ"
          className="mt-6"
          bordered
        >
          <p><strong>Вопрос:</strong> {selectedMessage.question}</p>
          <p><strong>Дата:</strong> {new Date(selectedMessage.createdAt).toLocaleString()}</p>
          <p><strong>Ответ:</strong></p>
          <Paragraph className="bg-gray-100 p-3 rounded-lg max-h-72 overflow-y-auto whitespace-pre-wrap">
            {selectedMessage.answer}
          </Paragraph>
        </Card>
      )}
    </div>
  );
}