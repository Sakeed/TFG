import {
  Eventcalendar,
  getJson,
  setOptions,
  Toast,
  localeEs,
} from "@mobiscroll/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import "@mobiscroll/react/dist/css/mobiscroll.min.css";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";

setOptions({
  locale: localeEs,
  theme: "ios",
  themeVariant: "light",
});

function Calendario() {
  const [myEvents, setEvents] = useState([]);
  const [isToastOpen, setToastOpen] = useState(false);
  const [toastText, setToastText] = useState();
  const [reuniones, setReuniones] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userAbogado } = useAuthContext();

  useEffect(() => {
    setLoading(true);
    if (userAbogado) {
      axios
        .get("http://localhost:3001/reunion", {
          headers: {
            Authorization: `Bearer ${userAbogado.token}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          const reunionesData = response.data.data;
          setReuniones(reunionesData);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    } else {
      console.log("No identificado");
    }
  }, [userAbogado]);

  //Crear las reuniones en el calendario
  useEffect(() => {
    if (reuniones.length > 0) {
      // Mapear las reuniones para crear eventos del calendario
      const eventos = reuniones.map((reunion) => ({
        id: reunion._id, // Suponiendo que la reunión tiene un campo 'id'
        title: reunion.asunto, // Suponiendo que la reunión tiene un campo 'titulo'
        start: new Date(reunion.fecha), // Suponiendo que la reunión tiene un campo 'fechaInicio'
        end: null, // Suponiendo que la reunión tiene un campo 'fechaFin'
      }));

      // Establecer los eventos en el estado
      setEvents(eventos);
    }
  }, [reuniones]);

  const handleToastClose = useCallback(() => {
    setToastOpen(false);
  }, []);

  const handleEventClick = useCallback((args) => {
    setToastText(args.event.title);
    setToastOpen(true);
  }, []);

  const myView = useMemo(() => ({ calendar: { labels: true } }), []);

  useEffect(() => {
    getJson((events) => {
      setEvents(events);
    }, "jsonp");
  }, []);

  return (
    <>
      <Eventcalendar
        clickToCreate={true}
        dragToCreate={false}
        dragToMove={false}
        dragToResize={false}
        eventDelete={false}
        data={myEvents}
        view={myView}
        onEventClick={handleEventClick}
      />
      <Toast
        message={toastText}
        isOpen={isToastOpen}
        onClose={handleToastClose}
      />
    </>
  );
}

export default Calendario;
