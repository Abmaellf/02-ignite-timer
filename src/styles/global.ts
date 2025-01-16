import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :focus {
    outline: 0;
    box-shadow: 0 0 0 2px ${props => props.theme['green-500']};
  }

body {
       background: ${props => props.theme['gray-900']};
       color:${props => props.theme['gray-300']};
     }

body, input, textarea, button {
  font-family: "Roboto", serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
  font-size: 1rem;
  font-variation-settings:
    "wdth" 100;
}
`;