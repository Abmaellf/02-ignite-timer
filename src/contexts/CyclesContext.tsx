import { createContext, ReactNode, useState, useReducer } from "react";
import { ActionTypes, Cycle, cyclesReducer } from "../reducers/cycles";

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
        activeCycleId: null
     })  /* useState<Cycle[]>([])    --> remover para criar o reducer*/
     
     const [amountSecondsPassed, setAmountSecondsPassed] = useState(0) // O total de segundos que já se passou, desde que o ciclo foi ativado

     const { cycles, activeCycleId } = cyclesState;
     const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

    // NÃO PRECISA MAIS const [activeCycleId, setActiveCycleId] = useState<string | null>(null)  // Ciclo que esta ativo

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    } 

    function markCurrentCycleAsFinished () {
       
        //     setCycles(state =>  state.map((cycle) => {
        //         if(cycle.id === activeCycleId) {
        //             return { ...cycle, finishedDate: new Date() }
        //          } else {
        //              return cycle
        //          }
        //      })
        // )

        dispatch({
            type: ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED,
            payload: {
                activeCycleId,
            },
        })
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
        dispatch({
            type: ActionTypes.ADD_NEW_CYCLE,
            payload: {
                newCycle,
            },
         })
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

    dispatch({
        type: ActionTypes.INTERRUPT_CURRENT_CYCLE,
        payload: {
            activeCycleId,
        },
    })
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