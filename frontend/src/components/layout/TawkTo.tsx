
import { useRef } from "react";
import TawkMessengerReact from '@tawk.to/tawk-messenger-react';

function TawkTo() {
  const tawkRef = useRef(null);

  return (
    <TawkMessengerReact
      propertyId="68a87276f16e1c19233f719d"
      widgetId="default"
      ref={tawkRef}
    />
  );
}

export default TawkTo;