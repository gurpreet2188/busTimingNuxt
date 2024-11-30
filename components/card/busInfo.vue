<script setup lang="ts">
import type {
    Service as BUS_INFO_SERVICE_TYPES,
    NextBus as NEXT_BUS_TYPE,
} from "../../types/bus";
import type { StopQuery, StopQueryResponse } from "~/types/stops";
import type { PropType } from "vue";

const props = defineProps({
    busCode: String,
    busTimings: Array<BUS_INFO_SERVICE_TYPES>,
    nextBus: Object as PropType<NEXT_BUS_TYPE>,
    nextBus2: Object as PropType<NEXT_BUS_TYPE>,
    nextBus3: Object as PropType<NEXT_BUS_TYPE>,
});

const busUTCToMins = (UTCTime: string): string => {
    const busUTC = Date.parse(UTCTime);
    const s = new Date(busUTC);
    const d = new Date();
    const delta = (s.getTime() - d.getTime()) / 60000;
    if (Number.isNaN(delta)) {
        return "";
    }
    return delta <= 1 ? "Arr" : Math.round(delta) + "";
};

const showOriginDestination: Ref<boolean> = ref(false);
const darkTheme: Ref<boolean> = useState("darkTheme");

const busOriginDestination: Ref<{
    origin: string | undefined;
    destination: string | undefined;
}> = ref({ origin: undefined, destination: undefined });

watch(
    showOriginDestination,
    async () => {
        if (
            showOriginDestination.value &&
            props.nextBus &&
            (!props.nextBus.DestinationCode || !props.nextBus.Origin)
        ) {
            let query: StopQuery = {
                name: props.nextBus.OriginCode,
            };
            const tempOrigin: StopQueryResponse = await $fetch(
                "/api/get-stop-info",
                {
                    method: "POST",
                    body: query,
                },
            );

            query = {
                name: props.nextBus.DestinationCode,
            };

            const tempDestination: StopQueryResponse = await $fetch(
                "/api/get-stop-info",
                {
                    method: "POST",
                    body: query,
                },
            );

            busOriginDestination.value.origin = tempOrigin.name;
            busOriginDestination.value.destination = tempDestination.name;
        }
    },
    { immediate: false, deep: true },
);

// const clickHandle = () => {
//     showOriginDestination.value = !showOriginDestination.value;
// };

const busLoadTextColor = (load: string | undefined) => {
    if (load) {
        // g - 99d98c , o- ffb600,
        if (darkTheme.value) {
            return load === "SEA"
                ? "#99d98c"
                : load === "SDA"
                  ? "#ffb600"
                  : "#ff4d6d";
        } else {
            return load === "SEA"
                ? "#84a98c"
                : load === "SDA"
                  ? "#ff7d00"
                  : "#ae2012";
        }
    }
};
</script>

<template>
    <div
        class="flex flex-col justify-center items-start gap-2 w-full text-[#6d6875] dark:text-[#ffcdb2]"
    >
        <!-- <div class="grid grid-cols-bus-info w-[100%]"> -->
        <!-- <button
            @click="clickHandle"
            class="flex flex-row justify-between items-center w-[100%]"
        > -->
        <div class="flex-[70%] grid grid-cols-3 gap-1 text-left text-xl w-full">
            <p v-show="nextBus" class="btn-common">
                {{ busCode }}
            </p>

            <p
                v-show="nextBus"
                class="flex flex-row justify-center items-center gap-2"
            >
                {{ nextBus && busUTCToMins(nextBus.EstimatedArrival) }}
                <CardBusTypeIcons
                    :bus-type="nextBus?.Type"
                    :color="busLoadTextColor(nextBus?.Load)"
                />
            </p>
            <p
                v-show="nextBus2"
                class="flex flex-row justify-center items-center gap-2"
            >
                {{ nextBus2 && busUTCToMins(nextBus2.EstimatedArrival) }}
                <CardBusTypeIcons
                    :bus-type="nextBus2?.Type"
                    :color="busLoadTextColor(nextBus2?.Load)"
                />
            </p>
            <!-- <p v-show="nextBus3" class="">
                {{ nextBus3 && busUTCToMins(nextBus3.EstimatedArrival) }}
            </p> -->
        </div>
        <!-- </button> -->

        <!-- <div class="flex flex-col justify-between overflow-hidden w-[100%]"> -->
        <!-- <div class="grid grid-cols-3 justify-items-center"> -->
        <!-- <p class="text-left opacity-0">{{ busCode }}</p> -->
        <!-- <CardBusTypeIcons
                    :bus-type="nextBus?.Type"
                    :color="busLoadTextColor(nextBus?.Load)"
                />
                <CardBusTypeIcons
                    :bus-type="nextBus2?.Type"
                    :color="busLoadTextColor(nextBus2?.Load)"
                /> -->
        <!-- <CardBusTypeIcons
                    :bus-type="nextBus3?.Type"
                    :color="busLoadTextColor(nextBus3?.Load)"
                /> -->
        <!-- </div> -->
        <!-- <p
                    v-if="
                        busOriginDestination.origin &&
                        busOriginDestination.destination
                    "
                    class="text-[0.7rem]"
                >
                    {{ busOriginDestination.origin }} ->
                    {{ busOriginDestination.destination }}
                </p> -->
        <!-- </div> -->

        <!-- </div> -->
    </div>
</template>

<style>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
