import { createContext, ReactNode, useState, useReducer } from "react";

interface  CreateCycleData {
    task: string;
    minutesAmount: number;
}

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;      // data que ele ficou ativo
    interruptedDate?: Date // Data da interrupção do cicloEssa data é opcional
    finishedDate?: Date // Data da conclusão do ciclo Essa data é opcional
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

interface CyclesState {
    cycles: Cycle[]
    activeCycleId: string | null
}

export function CycleContextProvider({ children }: CyclesContextProviderProps) {

     /*Minha lista de task como estado, sempre iniciando com a informaççao do mesmo tipo de utilização */
     const [cyclesState, dispatch] =  useReducer((state: CyclesState, action: any) => {
        switch(action.type) {
            case   'ADD_NEW_CYCLE':
                return {
                    ...state,
                    cycles:  [ ...state.cycles, action.payload.newCycle],
                    activeCycleId: action.payload.newCycle.id, 
                }
            case   'INTERRUPT_CURRENT_CYCLE':
                return {
                    ...state,
                    cycles: state.cycles.map((cycle) => {
                        if(cycle.id === state.activeCycleId) {
                            return { ...cycle, interruptedDate: new Date() }
                         } else {
                             return cycle
                         }
                     }),
                    activeCycleId: null,
                }
            case   'MARK_CURRENT_CYCLE_AS_FINISHED':
                return {
                    ...state,
                    cycles: state.cycles.map((cycle) => {
                        if(cycle.id === state.activeCycleId) {
                            return { ...cycle, finishedDate: new Date() }
                         } else {
                             return cycle
                         }
                     }),
                }
            default:
                return state
        }
                
     }, {
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
            type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
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
            type: 'ADD_NEW_CYCLE',
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
        type: 'INTERRUPT_CURRENT_CYCLE',
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