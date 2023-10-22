<script setup lang="ts">


const alertMessage: Ref<string> = ref('Checking Account Status...')
const alertMessageWait: Ref<boolean> = ref(true)
const readToSync: Ref<boolean> = ref(false)

const currentUser = useCurrentUser()

const setMessage = (msg: string, time: number, refVar: Ref<boolean>, refVal: boolean) => {
    setTimeout(() => {
        alertMessage.value = msg
        refVar.value = refVal
    }, time)
}

watchEffect(() => {
    // add delay for currentUser to update 
    // not trigger false -ve condition for 'Not Signed In'
   setTimeout(()=>{
    if (currentUser.value) {
        if (currentUser.value.uid) {
            setMessage('Welcome ' + currentUser?.value?.displayName, 1000, readToSync, true)
        } else {
            setMessage('Not Signed In.', 1000, alertMessageWait, false)
        }
    } else {
        setMessage('Not Signed In.', 1000, alertMessageWait, false)
    }
   },3000)
})

watchEffect(() => {
    if (readToSync.value) {
        setMessage('Syncing Data...', 1500, alertMessageWait, true)
        setMessage('Syncing Data...done!', 2000, alertMessageWait, false)
    }
})

</script>

<template>
    <AlertTip :message="alertMessage" :wait="alertMessageWait" />
</template>