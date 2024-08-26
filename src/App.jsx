import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClipboard, FaExchangeAlt } from 'react-icons/fa';
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
  background-size: 300%;
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

const AreaTexto = styled(motion.textarea)`
  width: 100%;
  height: 100px;
  padding: 10px;
  padding-right: 50px;
  background-color: #1a1a1a;
  color: #ffffff;
  border: 1px solid #ff7f50;
  border-radius: 10px;
  resize: none;
  font-size: 16px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ff7f50;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
  }
`;

const ContenedorAreaTextoSoloLectura = styled.div`
  position: relative;
  width: 90%;
  max-width: 400px;
  margin: 10px 0;
`;

const EnvolturaAreaTextoSoloLectura = styled(motion.div)`
  position: relative;
  width: 100%;
`;

const AreaTextoSoloLectura = styled(motion.textarea)`
  width: 100%;
  min-height: 60px;
  padding: 10px;
  padding-right: 50px;
  background-color: #1a1a1a;
  color: #ffffff;
  border: 1px solid #ff7f50;
  border-radius: 10px;
  resize: vertical;
  font-size: 16px;
  pointer-events: none;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ff7f50;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
  }
`;

const ContenedorIconos = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
`;

const IconoPortapapeles = styled(FaClipboard)`
  color: #ffffff;
  cursor: pointer;
  &:hover {
    color: #e06a3e;
  }
`;

const IconoBorrador = styled(RiEraserLine)`
  position: absolute;
  top: 10px;
  right: 10px;
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

const Mensaje = styled(motion.div)`
  color: #ff7f50;
  margin-top: 10px;
  font-size: 16px;
`;

const animacionSacudida = {
  x: [0, -10, 10, -10, 10, 0],
  transition: { duration: 0.5 }
};

const desvanecerYSalir = {
  initial: { opacity: 0, y: 0 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.5 },
};

function App() {
  const [textoEntrada, setTextoEntrada] = useState('');
  const [textoTraducido, setTextoTraducido] = useState('');
  const [idiomaOrigen, setIdiomaOrigen] = useState('ESPAÑOL');
  const [idiomaDestino, setIdiomaDestino] = useState('RROMANÉS');
  const [sacudida, setSacudida] = useState(false);
  const [sacudidaPortapapeles, setSacudidaPortapapeles] = useState(false);
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const referenciaAreaTexto = useRef(null);
  const { speak } = useSpeechSynthesis();

  const manejarCambioIdiomaOrigen = (event) => {
    const nuevoIdiomaOrigen = event.target.value;
    setIdiomaOrigen(nuevoIdiomaOrigen);

    // Ajustar el idioma de destino según el idioma de origen
    if (nuevoIdiomaOrigen === 'EUSKERA' || nuevoIdiomaOrigen === 'ESPAÑOL') {
      setIdiomaDestino('RROMANÉS');
    } else if (nuevoIdiomaOrigen === 'RROMANÉS') {
      setIdiomaDestino('ESPAÑOL'); // Por defecto al intercambiar si es RROMANÉS
    }
  };

  const manejarCambioIdiomaDestino = (event) => {
    const nuevoIdiomaDestino = event.target.value;
    setIdiomaDestino(nuevoIdiomaDestino);
  };

  const manejarIntercambioIdiomas = () => {
    const nuevoIdiomaOrigen = idiomaDestino;
    const nuevoIdiomaDestino = idiomaOrigen;

    setIdiomaOrigen(nuevoIdiomaOrigen);
    
    // Si el nuevo idioma de origen es EUSKERA o ESPAÑOL, el destino solo será RROMANÉS
    if (nuevoIdiomaOrigen === 'EUSKERA' || nuevoIdiomaOrigen === 'ESPAÑOL') {
      setIdiomaDestino('RROMANÉS');
    } else {
      setIdiomaDestino(nuevoIdiomaDestino); // Si es RROMANÉS, mantener el destino intercambiado
    }
  };

  const manejarTraduccion = () => {
    const palabras = textoEntrada.trim().split(' ');
    const palabrasTraducidas = palabras.map(palabra => {
      const traduccion = diccionario.find(item => item[idiomaOrigen].toLowerCase() === palabra.toLowerCase());
      if (traduccion) {
        return traduccion[idiomaDestino];
      } else {
        setSacudida(true);
        setTimeout(() => setSacudida(false), 500);
        return palabra;
      }
    });
    setTextoTraducido(palabrasTraducidas.join(' '));
  };

  const manejarCopiarAlPortapapeles = () => {
    navigator.clipboard.writeText(textoTraducido);
    setSacudidaPortapapeles(true);
    setMostrarMensaje(true);
    setTimeout(() => {
      setSacudidaPortapapeles(false);
    }, 500);
    setTimeout(() => {
      setMostrarMensaje(false);
    }, 3000);
  };

  const manejarBorrarTexto = () => {
    setTextoEntrada('');
    setTextoTraducido('');
  };

  const manejarLecturaVoz = () => {
    speak({ text: textoTraducido });
  };

  useEffect(() => {
    if (referenciaAreaTexto.current) {
      referenciaAreaTexto.current.style.height = 'auto';
      referenciaAreaTexto.current.style.height = referenciaAreaTexto.current.scrollHeight + 'px';
    }
  }, [textoTraducido]);

  return (
    <Contenedor>
      <img src={logo} alt="Logotipo" style={{ maxHeight: '150px' }} />

      {/* Contenedor con los selectores alineados en una fila */}
      <ContenedorSelectores>
        <SelectorContainer>
          <LabelSelector>DE:</LabelSelector>
          <Seleccion value={idiomaOrigen} onChange={manejarCambioIdiomaOrigen}>
            <option value="ESPAÑOL">ESPAÑOL</option>
            <option value="RROMANÉS">RROMANÉS</option>
            <option value="EUSKERA">EUSKERA</option>
          </Seleccion>
        </SelectorContainer>

        {/* Botón para intercambiar los idiomas */}
        <BotonIntercambiar onClick={manejarIntercambioIdiomas} />

        <SelectorContainer>
          <LabelSelector>A:</LabelSelector>
          <Seleccion value={idiomaDestino} onChange={manejarCambioIdiomaDestino} disabled={idiomaOrigen !== 'RROMANÉS'}>
            {idiomaOrigen === 'RROMANÉS' ? (
              <>
                <option value="ESPAÑOL">ESPAÑOL</option>
                <option value="EUSKERA">EUSKERA</option>
              </>
            ) : (
              <option value="RROMANÉS">RROMANÉS</option>
            )}
          </Seleccion>
        </SelectorContainer>
      </ContenedorSelectores>

      <ContenedorTextArea>
        <AreaTexto
          placeholder={`Escribe en ${idiomaOrigen}`}
          value={textoEntrada}
          onChange={(e) => setTextoEntrada(e.target.value)}
        />
        <IconoBorrador onClick={manejarBorrarTexto} size={20} />
      </ContenedorTextArea>
      <Boton onClick={manejarTraduccion}>TRADUCIR</Boton>
      <ContenedorAreaTextoSoloLectura>
        <EnvolturaAreaTextoSoloLectura animate={sacudida || sacudidaPortapapeles ? animacionSacudida : {}}>
          <AreaTextoSoloLectura
            readOnly
            ref={referenciaAreaTexto}
            placeholder={`Traducción en ${idiomaDestino}`}
            value={textoTraducido}
          />
          <ContenedorIconos>
            <IconoLecturaVoz onClick={manejarLecturaVoz} size={20} />
            <IconoPortapapeles onClick={manejarCopiarAlPortapapeles} size={20} />
          </ContenedorIconos>
        </EnvolturaAreaTextoSoloLectura>
      </ContenedorAreaTextoSoloLectura>
      <AnimatePresence>
        {mostrarMensaje && (
          <Mensaje
            initial="initial"
            animate="animate"
            exit="exit"
            variants={desvanecerYSalir}
          >
            Copiado al portapapeles
          </Mensaje>
        )}
      </AnimatePresence>
    </Contenedor>
  );
}

export default App;
