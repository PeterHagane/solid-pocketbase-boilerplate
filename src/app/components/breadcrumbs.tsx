import {
    Accessor,
    createContext,
    createSignal,
    For,
    onCleanup,
    onMount,
    ParentProps,
    Show,
    useContext,
  } from 'solid-js';
  
  type Crumb = {
    title: string;
    href: string;
  };
  
  const BreadcrumbContext =
    createContext<
      readonly [
        Accessor<Array<Crumb>>,
        { addCrumb: (crumb: Crumb) => void; removeCrumb: (crumb: Crumb) => void },
      ]
    >();
  
  export function BreadcrumbProvider(props: ParentProps) {
    const [crumbs, setCrumbs] = createSignal<Array<Crumb>>([]);
  
    const value = [
      crumbs,
      {
        addCrumb(crumb: Crumb) {
          setCrumbs((a) => [...a, crumb]);
        },
        removeCrumb({ title, href }: Crumb) {
          setCrumbs((a) => a.filter((c) => c.title !== title && c.href !== href));
        },
      },
    ] as const;
  
    return (
      <BreadcrumbContext.Provider value={value}>
        {props.children}
      </BreadcrumbContext.Provider>
    );
  }
  
  export function useCrumb(crumb: Crumb) {
    const [, { addCrumb, removeCrumb }] = useContext(BreadcrumbContext)!;
  
    onMount(() => addCrumb(crumb));
    onCleanup(() => removeCrumb(crumb));
  }
  
  export default function PageBreadcrumbs() {
    const [crumbs] = useContext(BreadcrumbContext)!;
  
    // const lastCrumb = () => {
    //   const list = crumbs();
  
    //   return list[Math.max(list.length - 1, 0)];
    // };
  
    // const initialCrumbs = () => {
    //   const list = crumbs();
  
    //   return list.slice(0, -1);
    // };
  
    return (<>
      <Show when={crumbs().length > 1}>
        <For each={crumbs()}>
            {(crumb)=>{ return <>{crumb.title}</>}}
        </For>
      </Show>
      </>
    );
  }