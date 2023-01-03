import DarkModeSwitcher from "@/components/dark-mode-switcher/Main";
import dom from "@left4code/tw-starter/dist/js/dom";
import logoUrl from "@/assets/images/logo.svg";
import illustrationUrl from "@/assets/images/illustration.svg";
import { useState, useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { fetchData } from "@/api";

function Main() {
    return (
      <div>
        <h1>Bienvenido</h1>
      </div>
    );
}

export default Main
