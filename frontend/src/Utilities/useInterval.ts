import React, { useEffect, useRef } from 'react';

type IntervalFunction = () => (unknown | void)
type SavedCallback = React.MutableRefObject<IntervalFunction | undefined>

function useInterval(callback: IntervalFunction, delay: number | null): void {
  const savedCallback: SavedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback.current) savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }

    return () => { /* do nothing */ };
  }, [delay]);
}

export default useInterval;
