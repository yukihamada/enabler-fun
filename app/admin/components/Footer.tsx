import React from 'react';

declare global {
  interface Window {
    difyChatbotConfig?: {
      token: string;
    };
  }
}

const Footer: React.FC = () => {
  React.useEffect(() => {
    window.difyChatbotConfig = {
      token: 'u7yabuLbCIAlYhdV'
    };
  }, []);

  return (
    <footer>
      <p>© {new Date().getFullYear()} Enabler</p>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.difyChatbotConfig = {
              token: 'u7yabuLbCIAlYhdV'
            }
          `
        }}
      />
      <script
        src="https://udify.app/embed.min.js"
        id="u7yabuLbCIAlYhdV"
        defer
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            #dify-chatbot-bubble-button {
              background-color: #1C64F2 !important;
            }
          `
        }}
      />
    </footer>
  );
};

export default Footer;