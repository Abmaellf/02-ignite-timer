import { Play } from "phosphor-react";
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
        TaskInput 
} from "./styles";
import { useEffect, useState } from "react";

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: 
        zod.number()
            .min(5, 'O ciclo precisa ser de no mínimo de 5 minutos')
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
} 

export function Home() {

    const [cycles, setCycles] = useState<Cycle[]>([]) /*Minha lista de task como estado, sempre iniciando com a informaççao do mesmo tipo de utilização */
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)  // Ciclo que esta ativo
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0) // O tanto de segundos que já se passou, desde que o ciclo foi ativado

    /*formState  - fornece uma variavel chamada errors, possibilitando identificar as mensagens que ocorre em nosso form: formState.errors  // console.log(formState.errors) */
    const { register, handleSubmit, watch, reset /*formState*/ } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,  
        }
    })

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

    useEffect(() => {
        if (activeCycle) {
            setInterval(()=> {
                setAmountSecondsPassed(
                    differenceInSeconds(new Date(), activeCycle.startDate),
                )
            }, 1000)
        }
    }, [activeCycle])

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
        
        reset();
    }

   

   const totalSeconds =  activeCycle ? activeCycle.minutesAmount * 60 : 0  // Verifica se tem ciclo ativo e se ativo, então o total de segundos será o minutos do ciclo ativo vezez 60 se não zero
   const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

   const minutesAmount = Math.floor(currentSeconds / 60)  // Dividindo o total de secundos por sessenta e arredondando para baixo
   const secondsAmount = currentSeconds % 60

   const minutes = String(minutesAmount).padStart(2, '0') // padStart sempre vai preencher com 2 caracteres
   const seconds = String(secondsAmount).padStart(2, '0') // padStart sempre vai preencher com 2 caracteres

    console.log(activeCycle)
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
                        min={5}
                        max={60}
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

                <StartCountdownButton disabled={isSubmitDisabled} type="submit">
                    <Play size={24} />
                    Começar
                </StartCountdownButton>
            </form> 
        </HomeContainer>
    )
}