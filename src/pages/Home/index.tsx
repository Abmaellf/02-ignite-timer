import { HandPalm, Play } from "phosphor-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from 'zod'; /* zod não tem um export default, então temos que renomear*/
import { differenceInSeconds } from "date-fns";

import { 
        CountdownContainer, 
        FormContainer, 
        HomeContainer, 
        MinutesAmountInput, 
        Separator, 
        StartCountdownButton, 
        StopCountdownButton, 
        TaskInput 
} from "./styles";
import { useEffect, useState } from "react";

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: 
        zod.number()
            .min(1, 'O ciclo precisa ser de no mínimo de 5 minutos') /* ajuste para um minuto para teste*/
            .max(60, 'O ciclo precisa se de no maximo de 60 minutos')
   
})
/*      Preferimos utilizar uma interface quando vamos definir um objeto de validação
        interface NewCycleFormData {
            task: string;
            minutesAmount: number;
        }     
*/

/* E prefirimos utilizaro type quando vamos criar uma tipagem apartir de outra referencia ou variável: do typescript*/
/* Agora não é mais necessário utilizar a interface */
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;      // data que ele ficou ativo
    interruptedDate?: Date // Data da interrupção do cicloEssa data é opcional
    finishedDate?: Date // Data da conclusão do ciclo Essa data é opcional
} 

export function Home() {

    const [cycles, setCycles] = useState<Cycle[]>([]) /*Minha lista de task como estado, sempre iniciando com a informaççao do mesmo tipo de utilização */
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)  // Ciclo que esta ativo
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0) // O total de segundos que já se passou, desde que o ciclo foi ativado

    /*formState  - fornece uma variavel chamada errors, possibilitando identificar as mensagens que ocorre em nosso form: formState.errors  // console.log(formState.errors) */
    const { register, handleSubmit, watch, reset /*formState*/ } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,  
        }
    })

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

    const totalSeconds =  activeCycle ? activeCycle.minutesAmount * 60 : 0  // Verifica se tem ciclo ativo e se ativo, então o total de segundos será o minutos do ciclo ativo vezez 60 se não zero

    /*o useEffect pode ter um retorno*/
    /* useEffect({ return },[])*/
    /*Esse  useEffect é para calcular a diferença do tempo passado em cada segundo e
      E se a diferença for maior ou igual ao total de segundos defindo(no caso terminou) então chama a função de finalizar
    */
    useEffect(() => {
        let interval: number;

        if (activeCycle) {

            interval = setInterval(()=> {

               const secondsDifference =  differenceInSeconds( 
                    new Date(), 
                    activeCycle.startDate
                ) /*calcula a diferença de segundos que já passaram, da data atual para data que começou o cliclo dentro de um intervalo de segundos começou o cilco  */
                
                if (secondsDifference >= totalSeconds ) {
                    setCycles(state =>  state.map((cycle) => {
                        if(cycle.id === activeCycleId) {
                            return { ...cycle, finishedDate: new Date() }
                         } else {
                             return cycle
                         }
                     })
                )
                
                setAmountSecondsPassed(totalSeconds)

                clearInterval(interval)
                } else {
                    setAmountSecondsPassed( secondsDifference )

                }
            }, 1000)
        }

        return () => {
            clearInterval(interval)
        }

    }, [activeCycle, totalSeconds, activeCycleId])

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

   const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

   const minutesAmount = Math.floor(currentSeconds / 60)  // Dividindo o total de secundos por sessenta e arredondando para baixo
   const secondsAmount = currentSeconds % 60

   const minutes = String(minutesAmount).padStart(2, '0') // padStart sempre vai preencher com 2 caracteres
   const seconds = String(secondsAmount).padStart(2, '0') // padStart sempre vai preencher com 2 caracteres

   useEffect(()=> {
    if(activeCycle) {
        document.title = `${minutes}:${seconds}`
    }
   }, [minutes, seconds, activeCycle])

    
    const task = watch('task')
    const isSubmitDisabled = !task

   

    return(
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
                 <FormContainer>
                     <label htmlFor="task">Vou trabalhar em</label>

                     <TaskInput 
                        id="task" 
                        list="task-suggestions" 
                        placeholder="Dê um nome para o seu projeto"
                        disabled={!!activeCycle}
                        {... register('task')}
                    />

                     <datalist id="task-suggestions">
                        <option value="Projeto 1" />
                        <option value="Projeto 2"/>
                        <option value="Projeto 3"/>
                        <option value="Banana"/>
                     </datalist>
 
                     <label htmlFor="">Durante</label>

                     <MinutesAmountInput 
                        type="number" 
                        id="minutesAmount"
                        step={5}
                        min={1} /*Ajustes de 5 para 1, para teste*/
                        max={60}
                        disabled={!!activeCycle}
                        {... register('minutesAmount', { valueAsNumber: true})}
                    />
 
                     <span>Minutos.</span>
                 </FormContainer>
           
                <CountdownContainer>
                    <span>{minutes[0]}</span>
                    <span>{minutes[1]}</span>
                    <Separator>:</Separator>
                    <span>{seconds[0]}</span>
                    <span>{seconds[1]}</span>
                </CountdownContainer>

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