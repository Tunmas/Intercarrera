import '../Styles/Datos.css';
import Life from "./Life";
import Temperatura from "./Temperatura";
import Estado from "./Estado";

const Datos = (props) => {
  return (
    <div className="Datos">
          <Life></Life>
          <Temperatura></Temperatura>
          <Estado></Estado>
    </div>
  );
};

export default Datos;
