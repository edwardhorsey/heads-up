import React, { useEffect, useRef } from 'react';

type IntervalFunction = () => ( unknown | void )

function useInterval(callback: IntervalFunction, delay: number | null): void {
  const savedCallback: React.MutableRefObject<any> = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default useInterval;