import { HandPalm, Play } from "phosphor-react";
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from 'zod'; /* zod não tem um export default, então temos que renomear*/

import {
        HomeContainer, 
        StartCountdownButton, 
        StopCountdownButton, 
} from "./styles";
import { createContext,  useState } from "react";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";


// Prop Drilling --> Quando agente tem MUITAS proprieddes APENAS para comunicação entre compopnentes 
// Context API --> Permite compartilharmos informações entre VÁRIOS   componentes ao mesmo tempo
/*      Preferimos utilizar uma interface quando vamos definir um objeto de validação
        interface NewCycleFormData {
            task: string;
            minutesAmount: number;
        }     
*/

/* E prefirimos utilizaro type quando vamos criar uma tipagem apartir de outra referencia ou variável: do typescript*/
/* Agora não é mais necessário utilizar a interface */


interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;      // data que ele ficou ativo
    interruptedDate?: Date // Data da interrupção do cicloEssa data é opcional
    finishedDate?: Date // Data da conclusão do ciclo Essa data é opcional
} 
interface CyclesContextType {
    activeCycle: Cycle | undefined
    activeCycleId: string | null
    amountSecondsPassed: number
    markCurrentCycleAsFinished: () => void
    setSecondsPassed: (seconds: number ) => void
}

// Como se fosse o transmissor do context
export const CyclesContext = createContext({} as CyclesContextType)

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: 
        zod.number()
            .min(1, 'O ciclo precisa ser de no mínimo de 5 minutos') /* ajuste para um minuto para teste*/
            .max(60, 'O ciclo precisa se de no maximo de 60 minutos')
   
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {

    const [cycles, setCycles] = useState<Cycle[]>([]) /*Minha lista de task como estado, sempre iniciando com a informaççao do mesmo tipo de utilização */
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)  // Ciclo que esta ativo
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0) // O total de segundos que já se passou, desde que o ciclo foi ativado

 /*formState  - fornece uma variavel chamada errors, possibilitando identificar as mensagens que ocorre em nosso form: formState.errors  // console.log(formState.errors) */
    const newCycleForm  = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,  
        }
    })

    const { handleSubmit, watch, reset } = newCycleForm

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    } 

    function markCurrentCycleAsFinished () {
       
            setCycles(state =>  state.map((cycle) => {
                if(cycle.id === activeCycleId) {
                    return { ...cycle, finishedDate: new Date() }
                 } else {
                     return cycle
                 }
             })
        )
    }

    function handleCreateNewCycle(data: NewCycleFormData) {

        const  id = String(new Date().getTime())

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }
        // setCycles([...cycles, newCycle])  /* Correto, mas como esse valor depende do valor atual vamos setar na forma de funççao*/
        
         setCycles((state) =>[...state, newCycle])  
         setActiveCycleId(id)
         setAmountSecondsPassed(0)
        
        reset();
    }

   function handleInterruptCycle() {
       setCycles((state) =>
       state.map((cycle) => {
               if(cycle.id === activeCycleId) {
                   return { ...cycle, interruptedDate: new Date() }
                } else {
                    return cycle
                }
            }),
        )
        setActiveCycleId(null)
  }
    
    const task = watch('task')

    const isSubmitDisabled = !task

    return(
        <HomeContainer>
            <form  onSubmit={handleSubmit(handleCreateNewCycle)}  action="">

            <CyclesContext.Provider 
                value={{ 
                    activeCycle, 
                    activeCycleId, 
                    markCurrentCycleAsFinished,
                    amountSecondsPassed,
                    setSecondsPassed
                }}>

                {/* /*FormProvider é o context padrão do react-hook-form */}
               <FormProvider {... newCycleForm}>
                    <NewCycleForm />
               </FormProvider>

               {/* /* PROPRIEDADES UTILIZADA PELO COUNTDOWN  activeCycle={activeCycle}  setCycles={setCycles}activeCycleId={activeCycleId} */}
               <Countdown   />

            </CyclesContext.Provider>
           
               { activeCycle ? (
                        <StopCountdownButton onClick={handleInterruptCycle} type="button">
                            <HandPalm size={24} />
                            Interromper
                        </StopCountdownButton>
                    ) : (
                        <StartCountdownButton disabled={isSubmitDisabled} type="submit">
                            <Play size={24} />
                            Começar
                        </StartCountdownButton>
                    )
               }

            </form> 
        </HomeContainer>
    )
}