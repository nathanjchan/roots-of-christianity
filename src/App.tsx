import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
  useLocation,
} from 'react-router-dom';

interface Quote {
  id: number;
  text: string;
  start: number;
  end: number;
}

interface Text {
  id: number;
  title: string;
  content: string;
  quotes: Quote[];
}

// Sample data structure
const initialTexts: Text[] = [
  {
    id: 1,
    title: 'Sample Text 1',
    content: 'This is the first sample text. It contains a quote.',
    quotes: [{ id: 1, text: 'It contains a quote', start: 35, end: 53 }],
  },
  {
    id: 2,
    title: 'Sample Text 2',
    content: "Here's another sample text with a different quote.",
    quotes: [{ id: 2, text: 'with a different quote', start: 33, end: 55 }],
  },
];

const App: React.FC = () => {
  const [texts] = useState<Text[]>(initialTexts);

  return (
    <Router>
      <div className='container mx-auto p-4'>
        <nav className='mb-4'>
          <ul className='flex space-x-4'>
            <li>
              <Link to='/' className='text-blue-500 hover:text-blue-700'>
                Texts
              </Link>
            </li>
            <li>
              <Link to='/quotes' className='text-blue-500 hover:text-blue-700'>
                Quotes
              </Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path='/' element={<TextView texts={texts} />} />
          <Route path='/text/:id' element={<TextDetail texts={texts} />} />
          <Route path='/quotes' element={<QuoteView texts={texts} />} />
        </Routes>
      </div>
    </Router>
  );
};

interface TextViewProps {
  texts: Text[];
}

const TextView: React.FC<TextViewProps> = ({ texts }) => {
  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Texts</h1>
      <ul>
        {texts.map((text) => (
          <li key={text.id} className='mb-2'>
            <Link to={`/text/${text.id}`} className='text-blue-500 hover:text-blue-700'>
              {text.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

interface TextDetailProps {
  texts: Text[];
}

const TextDetail: React.FC<TextDetailProps> = ({ texts }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const text = texts.find((t) => t.id === parseInt(id || ''));

  if (!text) return <div>Text not found</div>;

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>{text.title}</h1>
      <p>
        {text.content.split('').map((char, index) => {
          const quote = text.quotes.find((q) => index >= q.start && index < q.end);
          return quote ? (
            <span
              key={index}
              className='bg-yellow-200 cursor-pointer'
              onClick={() => navigate('/quotes', { state: { highlightQuote: quote.id } })}
            >
              {char}
            </span>
          ) : (
            char
          );
        })}
      </p>
    </div>
  );
};

interface QuoteViewProps {
  texts: Text[];
}

const QuoteView: React.FC<QuoteViewProps> = ({ texts }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const allQuotes = texts.flatMap((text) =>
    text.quotes.map((quote) => ({ ...quote, textId: text.id, textTitle: text.title })),
  );

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Quotes</h1>
      <ul>
        {allQuotes.map((quote) => (
          <li key={quote.id} className='mb-2'>
            <span
              className='cursor-pointer text-blue-500 hover:text-blue-700'
              onClick={() =>
                navigate(`/text/${quote.textId}`, { state: { highlightQuote: quote.id } })
              }
            >
              "{quote.text}" - {quote.textTitle}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
