import React, { useState, useEffect } from 'react';
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
  id: string;
  title: string;
  content: string;
  quotes: Quote[];
}

const App: React.FC = () => {
  const [texts, setTexts] = useState<Text[]>([]);

  useEffect(() => {
    const loadTexts = async () => {
      const textModules = import.meta.glob('/src/assets/*.json');
      const loadedTexts: Text[] = [];

      for (const path in textModules) {
        const mod = await textModules[path]();
        const id = path.split('/').pop()?.replace('.json', '') || '';
        loadedTexts.push({ ...mod.default, id });
      }

      setTexts(loadedTexts);
    };

    loadTexts();
  }, []);

  return (
    <Router>
      <div className='container mx-auto p-4'>
        <nav className='mb-4'>
          <ul className='flex space-x-4'>
            <li>
              <Link to='/' className='text-blue-500 hover:text-blue-700'>
                Quotes
              </Link>
            </li>
            {texts.map((text) => (
              <li key={text.id}>
                <Link to={`/text/${text.id}`} className='text-blue-500 hover:text-blue-700'>
                  {text.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Routes>
          <Route path='/' element={<QuoteView texts={texts} />} />
          <Route path='/text/:id' element={<TextDetail texts={texts} />} />
        </Routes>
      </div>
    </Router>
  );
};

interface TextDetailProps {
  texts: Text[];
}

const TextDetail: React.FC<TextDetailProps> = ({ texts }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const text = texts.find((t) => t.id === id);

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
              onClick={() => navigate('/', { state: { highlightQuote: quote.id } })}
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
          <li key={`${quote.textId}-${quote.id}`} className='mb-2'>
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
