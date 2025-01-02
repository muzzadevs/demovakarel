import React, { useState } from 'react';
import styled from 'styled-components';
import { FaExchangeAlt, FaClipboard } from 'react-icons/fa';
import { RiEraserLine } from 'react-icons/ri';
import { MdOutlineRecordVoiceOver } from 'react-icons/md';
import { useSpeechSynthesis } from 'react-speech-kit';
import diccionario from "./diccionario";
import logo from "/logo.png";

const Contenedor = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(270deg, #ff7f50, #000000);
  color: #ffffff;
  min-height: 100vh;
  padding: 20px;
`;

const ContenedorSelectores = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 90%;
  max-width: 400px;
  margin: 10px 0;
`;

const SelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 48%;
`;

const LabelSelector = styled.label`
  font-size: 12px;
  color: #ff7f50;
  margin-bottom: 5px;
`;

const Seleccion = styled.select`
  width: 100%;
  padding: 10px;
  background-color: #1a1a1a;
  color: #ffffff;
  border: 1px solid #ff7f50;
  border-radius: 10px;
  font-size: 16px;
`;

const BotonIntercambiar = styled(FaExchangeAlt)`
  color: #ff7f50;
  cursor: pointer;
  margin: 0 10px;

  &:hover {
    color: #e06a3e;
  }
`;

const ContenedorTextArea = styled.div`
  position: relative;
  width: 90%;
  max-width: 400px;
  margin: 10px 0;
`;

const InputTexto = styled.input`
  width: 100%;
  padding: 10px;
  background-color: #1a1a1a;
  color: #ffffff;
  border: 1px solid #ff7f50;
  border-radius: 10px;
  font-size: 16px;
`;

const Dropdown = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #1a1a1a;
  border: 1px solid #ff7f50;
  border-radius: 10px;
  max-height: 200px;
  overflow-y: auto;
  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 100;
`;

const DropdownItem = styled.li`
  padding: 10px;
  color: #ffffff;
  cursor: pointer;
  &:hover {
    background-color: #ff7f50;
  }
`;

const AreaTextoSoloLectura = styled.textarea`
  width: 90%;
  max-width: 400px;
  min-height: 60px;
  padding: 10px;
  background-color: #1a1a1a;
  color: #ffffff;
  border: 1px solid #ff7f50;
  border-radius: 10px;
  resize: vertical;
  font-size: 16px;
  pointer-events: none;
  margin-top: 10px;
  margin-bottom: 20px;
  overflow-y: auto;
`;

const ContenedorIconos = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
`;

const IconoBorrador = styled(RiEraserLine)`
  color: #ffffff;
  cursor: pointer;

  &:hover {
    color: #e06a3e;
  }
`;

const IconoLecturaVoz = styled(MdOutlineRecordVoiceOver)`
  color: #ffffff;
  cursor: pointer;

  &:hover {
    color: #e06a3e;
  }
`;

const IconoPortapapeles = styled(FaClipboard)`
  color: #ffffff;
  cursor: pointer;

  &:hover {
    color: #e06a3e;
  }
`;

const Boton = styled.button`
  width: 90%;
  max-width: 400px;
  padding: 10px;
  margin: 10px 0;
  background-color: white;
  color: #000000;
  font-weight: 700;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #e06a3e;
  }
`;

function App() {
  const [textoEntrada, setTextoEntrada] = useState('');
  const [textoTraducido, setTextoTraducido] = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const [idiomaOrigen, setIdiomaOrigen] = useState('ESPAÑOL');
  const [idiomaDestino, setIdiomaDestino] = useState('RROMANÉS');
  const { speak } = useSpeechSynthesis();

  const idiomasDisponibles = ['ESPAÑOL', 'RROMANÉS', 'EUSKERA'];

  const obtenerOpcionesDestino = (idiomaOrigen) => {
    if (idiomaOrigen === 'RROMANÉS') {
      return ['ESPAÑOL', 'EUSKERA'];
    } else {
      return ['RROMANÉS'];
    }
  };

  const manejarCambioOrigen = (nuevoOrigen) => {
    setIdiomaOrigen(nuevoOrigen);
    const opcionesDestino = obtenerOpcionesDestino(nuevoOrigen);
    if (!opcionesDestino.includes(idiomaDestino)) {
      setIdiomaDestino(opcionesDestino[0]);
    }
  };

  const manejarIntercambio = () => {
    const nuevoOrigen = idiomaDestino;
    const nuevoDestino = idiomaOrigen;
    manejarCambioOrigen(nuevoOrigen);
    setIdiomaDestino(nuevoDestino);
  };

  const manejarCambioTexto = (e) => {
    const valor = e.target.value;
    setTextoEntrada(valor);

    if (valor) {
      const coincidencias = diccionario
        .filter((item) =>
          item[idiomaOrigen]?.toLowerCase().startsWith(valor.toLowerCase())
        )
        .map((item) => item[idiomaOrigen])
        .slice(0, 10);
      setSugerencias(coincidencias);
    } else {
      setSugerencias([]);
    }
  };

  const seleccionarSugerencia = (sugerencia) => {
    setTextoEntrada(sugerencia);
    setSugerencias([]);
  };

  const manejarTraduccion = () => {
    const palabras = textoEntrada.trim().split(' ');
    const palabrasTraducidas = palabras.map((palabra) => {
      const traduccion = diccionario.find(
        (item) => item[idiomaOrigen]?.toLowerCase() === palabra.toLowerCase()
      );
      return traduccion ? traduccion[idiomaDestino] : palabra;
    });
    setTextoTraducido(palabrasTraducidas.join(' '));
  };

  const manejarBorrarTexto = () => {
    setTextoEntrada('');
    setTextoTraducido('');
    setSugerencias([]);
  };

  const manejarCopiarAlPortapapeles = () => {
    navigator.clipboard.writeText(textoTraducido);
    alert('Texto copiado al portapapeles');
  };

  const manejarLecturaVoz = () => {
    speak({ text: textoTraducido });
  };

  return (
    <Contenedor>
      <img src={logo} alt="Logotipo" style={{ maxHeight: '150px' }} />
      <ContenedorSelectores>
        <SelectorContainer>
          <LabelSelector>DE:</LabelSelector>
          <Seleccion
            value={idiomaOrigen}
            onChange={(e) => manejarCambioOrigen(e.target.value)}
          >
            {idiomasDisponibles.map((idioma) => (
              <option key={idioma} value={idioma}>
                {idioma}
              </option>
            ))}
          </Seleccion>
        </SelectorContainer>
        <BotonIntercambiar onClick={manejarIntercambio} />
        <SelectorContainer>
          <LabelSelector>A:</LabelSelector>
          <Seleccion
            value={idiomaDestino}
            onChange={(e) => setIdiomaDestino(e.target.value)}
          >
            {obtenerOpcionesDestino(idiomaOrigen).map((idioma) => (
              <option key={idioma} value={idioma}>
                {idioma}
              </option>
            ))}
          </Seleccion>
        </SelectorContainer>
      </ContenedorSelectores>
      <ContenedorTextArea>
        <InputTexto
          placeholder={`Escribe en ${idiomaOrigen}`}
          value={textoEntrada}
          onChange={manejarCambioTexto}
        />
        {sugerencias.length > 0 && (
          <Dropdown>
            {sugerencias.map((sugerencia, index) => (
              <DropdownItem
                key={index}
                onClick={() => seleccionarSugerencia(sugerencia)}
              >
                {sugerencia}
              </DropdownItem>
            ))}
          </Dropdown>
        )}
      </ContenedorTextArea>
      <Boton onClick={manejarTraduccion}>TRADUCIR</Boton>
      <AreaTextoSoloLectura
        readOnly
        value={textoTraducido}
        placeholder={`Traducción en ${idiomaDestino}`}
      />
      <ContenedorIconos>
        <IconoBorrador size={24} onClick={manejarBorrarTexto} title="Borrar lo escrito" />
        <IconoLecturaVoz size={24} onClick={manejarLecturaVoz} title="Leer lo traducido" />
        <IconoPortapapeles
          size={24}
          onClick={manejarCopiarAlPortapapeles}
          title="Copiar al portapapeles"
        />
      </ContenedorIconos>
    </Contenedor>
  );
}

export default App;
