"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _openai = require("openai");

class OpenAiProvider {
  constructor() {
    this.openai = void 0;
    const configuration = new _openai.Configuration({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.openai = new _openai.OpenAIApi(configuration);
  }

  async correctionEssay({
    theme,
    text,
    isFour
  }) {
    try {
      const prompt = `Corrija a redação a seguir sobre o tema '${theme}' utilizando os critérios do ENEM e seguindo a estrutura JSON apresentada anteriormente. Em suas críticas, cite trechos da redação que precisam ser melhorados em cada competencia. (Obs: Não escreva mais nada a não ser o JSON e não seja tão rigoroso na redação, se coloque no lugar de um professor que tem centenas de redações dessa para corrigir no dia): \n\n ${text}`;
      const completion = await this.openai.createChatCompletion({
        model: isFour ? 'gpt-4' : 'gpt-3.5-turbo',
        messages: [{
          role: 'assistant',
          content: '{\n  "competencia1": {\n    "descricao": "A redação apresenta uma escrita clara e coesa, com uso adequado da norma culta da língua portuguesa. Não foram identificados erros gramaticais ou de ortografia que prejudiquem a compreensão do texto.",\n    "nota": 200\n  },\n  "competencia2": {\n    "descricao": "O autor compreendeu a proposta da redação e aplicou conceitos das áreas de conhecimento de forma adequada para desenvolver o tema proposto. É possível identificar referências à sociologia e à antropologia, por exemplo, que enriquecem a argumentação. No entanto, seria interessante uma maior profundidade na análise dos conceitos apresentados.",\n    "nota": 180\n  },\n  "competencia3": {\n    "descricao": "O autor selecionou informações relevantes para o desenvolvimento do tema proposto e as organizou de forma coerente e coesa. Além disso, as informações foram interpretadas de forma adequada, demonstrando compreensão do tema. No entanto, faltou uma maior conexão entre os argumentos apresentados, o que prejudica a coesão do texto.",\n    "nota": 180\n  },\n  "competencia4": {\n    "descricao": "O autor demonstrou habilidade na construção da argumentação, utilizando mecanismos linguísticos adequados para a coesão e coerência do texto. Foram utilizados conectivos e marcadores de argumentação de forma eficiente, contribuindo para a clareza e fluidez do texto. No entanto, faltou uma maior variedade de recursos linguísticos, o que poderia enriquecer ainda mais a redação.",\n    "nota": 180\n  },\n  "competencia5": {\n    "descricao": "A proposta de intervenção apresentada é adequada e respeita os direitos humanos, mas poderia ser mais detalhada e específica. Faltou uma conexão mais clara entre a proposta e os argumentos apresentados no desenvolvimento do texto. Seria interessante apresentar exemplos concretos de como a proposta poderia ser implementada na prática.",\n    "nota": 180\n  },\n  "pontosFortes:": "A redação apresenta uma argumentação bem fundamentada e coesa, com uso adequado da norma culta da língua portuguesa. O autor demonstrou compreensão do tema e habilidade na construção da argumentação, utilizando mecanismos linguísticos adequados para a coesão e coerência do texto.",\n  "pontosAMelhorar": "Faltou uma maior profundidade na análise dos conceitos apresentados e uma maior conexão entre os argumentos apresentados. Além disso, a proposta de intervenção poderia ser mais detalhada e específica, com exemplos concretos de como poderia ser implementada na prática."\n}'
        }, {
          role: 'user',
          content: prompt
        }],
        temperature: 0.1
      });
      return {
        prompt: prompt,
        completion: completion.data.choices[0].message.content
      };
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data);
      } else {
        throw new Error(error.message);
      }
    }
  }

  async fixOrthography(text) {
    try {
      const prompt = `Corrija as palavras do texto a seguir: me retorne somente o texto corrigido: ${text}`;
      const completion = await this.openai.createChatCompletion({
        model: 'gpt-4',
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 0.1
      });
      return completion.data.choices[0].message.content;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data);
      } else {
        throw new Error(error.message);
      }
    }
  }

}

var _default = OpenAiProvider;
exports.default = _default;