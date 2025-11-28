    import OpenAI from "openai";

    export const avaliaReceita = async (receita) => {

      const ingredientes = receita.ingredientes.join(", ");
      const modoPreparo = receita.modo_preparo.join(", ");
      const utensilios = receita.utensilios.join(", ");



      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      try {
        const response = await openai.responses.create({
          prompt: {
            "id": "pmpt_68a37c32d4b48194ae940b496cc41e8e0f267eb411e5aa40",
            "version": "19",
            variables: {
              "titulo": receita.titulo,
              "descricao": receita.descricao,
              "ingredientes": ingredientes,
              "mododepreparo": modoPreparo,
              "utensilios": utensilios,
            },
          }
        });
        console.log("Avaliação da Receita:", response.output_text);
        return response.output_text
      } catch (error) {
        console.error("Error:", error);

      }


      return "rejeitada";
    };

    export const fazConsulta = async (req, res) => {
      const { requisicao } = req.body;

      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      try {
        const response = await openai.responses.create({
          prompt: {
            "id": "pmpt_6890e5e24f608190a50e3fa67a5d87e3021ecd17f1989d39",
            "version": "31",
            "variables": {
              "request": requisicao,
            },
          }
        });
        console.log(response.output_text);
        res.status(200).json({ resposta: response.output_text });
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ mensagem: "Erro no servidor", detalhe: error.message });
      }
    };
    export const avaliaComentario = async (comentario) => {


      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      try {
        const response = await openai.responses.create({
          prompt: {
            "id": "pmpt_68f2eeb39e3c8196b8d357bab1918e7b076eb82b3056f9ce",
            "version": "2",
            "variables": {
              "comentario": comentario,
            }
          }
        });

        return response.output_text
      } catch (error) {
        console.error("Error:", error);

      }


      return "rejeitada";
    };