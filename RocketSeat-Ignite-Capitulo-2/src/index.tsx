import React from "react";
import ReactDOM from "react-dom";
import { createServer, Model } from "miragejs";
import App from "./App";

createServer({
  models: {
    transaction: Model,
  },

  seeds(server) {
    server.db.loadData({
      transactions: [
        {
          id: 1,
          title: "puteiro da esquina",
          type: "withdraw",
          category: "Entretenimento",
          amount: 9586,
          createdAt: new Date("2021-01-20 12:00:00"),
        },
        {
          id: 3,
          title: "gogoboy",
          type: "deposit",
          category: "Trabalho",
          amount: 1213,
          createdAt: new Date("2021-01-11 09:00:00"),
        },
      ],
    });
  },

  routes() {
    this.namespace = "api";
    this.get("/transactions", () => {
      return this.schema.all("transaction");
    });

    this.post("/transactions", (schema, request) => {
      const data = JSON.parse(request.requestBody);
      console.log("index index"+data)
      return this.schema.create("transaction", data);
    });
  },
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
