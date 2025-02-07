import { createContext, ReactNode, useState, useReducer, useEffect } from "react";
import { Cycle, cyclesReducer } from "../reducers/cycles/reducer";
import { addNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";
import { differenceInSeconds } from "date-fns";

interface  CreateCycleData {
    task: string;
    minutesAmount: number;
}


interface CyclesContextType {
    cycles: Cycle[]
    activeCycle: Cycle | undefined
    activeCycleId: string | null
    amountSecondsPassed: number
    markCurrentCycleAsFinished: () => void
    setSecondsPassed: (seconds: number ) => void
    createNewCycle: (data: CreateCycleData ) => void
    interruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
    children: ReactNode
}

export function CycleContextProvider({ children }: CyclesContextProviderProps) {

     /*Minha lista de task como estado, sempre iniciando com a informaççao do mesmo tipo de utilização */
     const [cyclesState, dispatch] =  useReducer(cyclesReducer,
     {
        cycles: [],
        activeCycleId: null,
     }, 
     (initialState)=> {
        const storedStateAsJSON = localStorage.getItem(
            '@ignite-timer:cycle-state-1.0.0'
        )

        if(storedStateAsJSON) {
            return JSON.parse(storedStateAsJSON)
        }

        return initialState
     })  /* useState<Cycle[]>([])    --> remover para criar o reducer*/
     
     const { cycles, activeCycleId } = cyclesState;
     const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

     const [amountSecondsPassed, setAmountSecondsPassed] = useState(()=> {
     if(activeCycle) {
        return differenceInSeconds( 
            new Date(), 
            new Date(activeCycle.startDate)
        )
     }
        return 0
     }) // O total de segundos que já se passou, desde que o ciclo foi ativado
     
     useEffect(()=> {
        const stateJSON = JSON.stringify(cyclesState)
        localStorage.setItem('@ignite-timer:cycle-state-1.0.0', stateJSON)
     }, [cyclesState])

     
     

    // NÃO PRECISA MAIS const [activeCycleId, setActiveCycleId] = useState<string | null>(null)  // Ciclo que esta ativo

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    } 

    function markCurrentCycleAsFinished () {
        dispatch(markCurrentCycleAsFinishedAction())
    }

    function createNewCycle(data: CreateCycleData) {

        const  id = String(new Date().getTime())

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }
        // setCycles([...cycles, newCycle])  /* Correto, mas como esse valor depende do valor atual vamos setar na forma de funççao*/
        
        //  setCycles((state) =>[...state, newCycle]) 
        dispatch(addNewCycleAction(newCycle))
        setAmountSecondsPassed(0)
        // reset(); Não será mais chamado aqui
    }

    function interruptCurrentCycle() {
    //    setCycles((state) =>
    //    state.map((cycle) => {
    //            if(cycle.id === activeCycleId) {
    //                return { ...cycle, interruptedDate: new Date() }
    //             } else {
    //                 return cycle
    //             }
    //         }),
    //     )

    dispatch(interruptCurrentCycleAction())
  }
    return(
        <CyclesContext.Provider 
        value={{ 
            cycles,
            activeCycle, 
            activeCycleId, 
            markCurrentCycleAsFinished,
            amountSecondsPassed,
            setSecondsPassed,
            createNewCycle,
            interruptCurrentCycle
        }}>
            {children}
         </CyclesContext.Provider>
    )
}