import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "@/assets/index.scss"
import MiniApp from "@/components/MiniApp/MiniApp.tsx"

ReactDOM.createRoot(document.getElementById("root")!).render((
  <React.StrictMode>
    <MiniApp>
      <App/>
    </MiniApp>
  </React.StrictMode>
))
