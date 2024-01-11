import React, { useState, useRef, useEffect } from "react";

export default function GoogleLoginButton({
  onSuccess,
  onError,
  type = "standard",
  theme = "outline",
  size = "large",
  text,
  shape,
  logoAlignment,
  width,
  locale,
  clientId,
  ...props
}) {
  const [isOAuthClientLoaded, setIsOAuthClientLoaded] = useState(false);

  const btnContainerRef = useRef(null);

  useEffect(() => {
    const scriptTag = document.createElement("script");

    scriptTag.src = "https://accounts.google.com/gsi/client";
    scriptTag.async = true;
    scriptTag.defer = true;

    scriptTag.onload = () => {
      setIsOAuthClientLoaded(true);
    };

    scriptTag.onerror = () => {
      setIsOAuthClientLoaded(false);
    };

    document.body.appendChild(scriptTag);

    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  useEffect(() => {
    if (!isOAuthClientLoaded) {
      return;
    }
    window.google?.accounts.id.initialize({
      client_id: clientId,
      callback: (credentialResponse) => {
        if (!credentialResponse.clientId || !credentialResponse.credential) {
          onError(new Error("Client id is invalid when initializing"));

          return;
        }

        onSuccess(credentialResponse);
      },
      ...props,
    });

    window.google.accounts.id.renderButton(btnContainerRef?.current, {
      type,
      theme,
      size,
      text,
      shape,
      logo_alignment: logoAlignment,
      width,
      locale,
    });
  }, [
    onSuccess,
    onError,
    clientId,
    type,
    theme,
    size,
    text,
    shape,
    logoAlignment,
    width,
    locale,
    props,
    isOAuthClientLoaded,
  ]);

  return <div ref={btnContainerRef} />;
}
