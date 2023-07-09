import { stream } from '@thi.ng/rstream';

export const resizeObserver = (element: Element) => {
  const entries$ = stream<ResizeObserverEntry[]>();

  const observer = new ResizeObserver(entries => {
    entries$.next(entries);
  });

  // Observe one or multiple elements
  observer.observe(element);

  return entries$;
}
