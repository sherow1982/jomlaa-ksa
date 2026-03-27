import { useState, useEffect, useRef } from 'react';
import products from '../data/jomla-ksa-products.json';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'مرحباً! أنا مساعدك الذكي في متجر السعودية 🇴🇲\nكيف يمكنني مساعدتك اليوم؟' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findProducts = (query) => {
    const q = query.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description?.toLowerCase().includes(q) ||
      p.google_product_category?.toLowerCase().includes(q)
    );
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);

    const query = input.toLowerCase();
    let botResponse = '';

    // البحث عن المنتجات
    if (query.includes('ابحث') || query.includes('اريد') || query.includes('عندكم') || query.includes('موجود')) {
      // استخراج الكلمات المفتاحية بحذف كلمات الأمر
      const searchQuery = input.replace(/ابحث عن|اريد|عندكم|موجود|عن/gi, '').trim();
      const results = findProducts(searchQuery);
      if (results.length > 0) {
        botResponse = `وجدت ${results.length} منتج:\n\n`;
        results.slice(0, 3).forEach(p => {
          const price = p.sale_price || p.price;
          botResponse += `📦 ${p.name}\n💰 ${price} ريال\n⭐ ${p.average_rating || 'N/A'}\n\n`;
        });
        if (results.length > 3) {
          botResponse += `وهناك ${results.length - 3} منتج آخر...`;
        }
      } else {
        botResponse = 'عذراً، لم أجد منتجات مطابقة. جرب البحث بكلمات أخرى.';
      }
    }
    // معلومات الشحن
    else if (query.includes('شحن') || query.includes('توصيل')) {
      botResponse = '🚚 معلومات الشحن:\n✅ شحن مجاني لجميع المنتجات\n✅ التوصيل خلال 1-3 أيام عمل\n✅ الشحن من داخل سلطنة عُمان';
    }
    // معلومات الإرجاع
    else if (query.includes('ارجاع') || query.includes('استرجاع')) {
      botResponse = '🔄 سياسة الإرجاع:\n✅ إرجاع مجاني خلال 14 يوم\n⚠️ لا نقبل إرجاع منتجات العناية الشخصية';
    }
    // الأسعار والضرائب
    else if (query.includes('ضريبة') || query.includes('سعر')) {
      botResponse = '💰 معلومات الأسعار:\n✅ لا توجد ضرائب\n✅ الأسعار شاملة كل شيء\n✅ عروض خاصة على منتجات مختارة';
    }
    // التواصل
    else if (query.includes('تواصل') || query.includes('واتساب') || query.includes('اتصال')) {
      botResponse = '📞 التواصل معنا:\n📱 واتساب: +201110760081\n📧 البريد: sherow1982@gmail.com\n🌐 الموقع: https://jomla-ksa-store.com';
    }
    // عدد المنتجات
    else if (query.includes('كم') || query.includes('عدد')) {
      botResponse = `📊 إحصائيات المتجر:\n📦 ${products.length} منتج متوفر\n🏷️ 35 فئة مختلفة\n⭐ تقييمات السعوديةية حقيقية`;
    }
    // الرد الافتراضي
    else {
      botResponse = 'يمكنني مساعدتك في:\n\n🔍 البحث عن المنتجات\n📦 معلومات الشحن والتوصيل\n🔄 سياسة الإرجاع\n💰 الأسعار والضرائب\n📞 التواصل معنا\n\nاكتب ما تريد البحث عنه!';
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', text: botResponse }]);
    }, 500);

    setInput('');
  };

  return (
    <>
      {/* زر الشات */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="chatbot-button"
        aria-label="فتح الشات"
        style={{ bottom: '170px', right: '20px' }}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* نافذة الشات */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>🤖 مساعد متجر السعودية</h3>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.type}`}>
                <div className="message-bubble">{msg.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="اكتب رسالتك..."
              style={{ direction: 'rtl' }}
            />
            <button onClick={handleSend}>إرسال</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .chatbot-button {
          position: fixed;
          bottom: 170px;
          right: 20px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          font-size: 28px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 1000;
          transition: all 0.3s ease;
        }

        .chatbot-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(0,0,0,0.2);
        }

        .chatbot-window {
          position: fixed;
          bottom: 240px;
          right: 20px;
          width: 90%;
          max-width: 380px;
          height: 500px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          z-index: 999;
          overflow: hidden;
        }

        .chatbot-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chatbot-header h3 {
          margin: 0;
          font-size: 18px;
        }

        .chatbot-header button {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
        }

        .chatbot-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          background: #f5f5f5;
        }

        .message {
          margin-bottom: 12px;
          display: flex;
        }

        .message.user {
          justify-content: flex-end;
        }

        .message.bot {
          justify-content: flex-start;
        }

        .message-bubble {
          max-width: 75%;
          padding: 12px 16px;
          border-radius: 18px;
          white-space: pre-line;
          line-height: 1.5;
        }

        .message.user .message-bubble {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .message.bot .message-bubble {
          background: white;
          color: #333;
          border-bottom-left-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .chatbot-input {
          display: flex;
          padding: 12px;
          background: white;
          border-top: 1px solid #e0e0e0;
        }

        .chatbot-input input {
          flex: 1;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 24px;
          font-size: 14px;
          outline: none;
        }

        .chatbot-input input:focus {
          border-color: #667eea;
        }

        .chatbot-input button {
          margin-right: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 24px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
        }

        .chatbot-input button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        @media (max-width: 768px) {
          .chatbot-window {
            width: calc(100% - 40px);
            height: 450px;
            bottom: 160px;
          }

          .chatbot-button {
            width: 56px;
            height: 56px;
            font-size: 24px;
          }
        }
      `}</style>
    </>
  );
}
