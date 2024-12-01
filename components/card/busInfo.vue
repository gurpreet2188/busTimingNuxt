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

const size = {
    w: "20px",
    h: "20px",
};
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
        <div class="flex-[70%] grid grid-cols-3 gap-8 text-left text-xl w-full">
            <p v-show="nextBus" class="btn-common text-2xl">
                {{ busCode }}
            </p>

            <div
                class="mr-2 ml-auto flex flex-row justify-center items-center gap-2"
            >
                <p v-show="nextBus" class="text-3xl">
                    {{ nextBus && busUTCToMins(nextBus.EstimatedArrival) }}
                </p>
                <div class="flex flex-col justify-center items-center">
                    <IconsWheelChair
                        v-if="nextBus?.Feature === 'WAB'"
                        :active="true"
                        :size="size"
                        :color="darkTheme ? '#ffcdb2' : '#6d6875'"
                    />
                    <CardBusTypeIcons
                        :bus-type="nextBus?.Type"
                        :color="busLoadTextColor(nextBus?.Load)"
                    />
                </div>
            </div>
            <div
                class="mr-2 ml-auto flex flex-row justify-center items-center gap-2"
            >
                <p v-show="nextBus2" class="text-3xl">
                    {{ nextBus2 && busUTCToMins(nextBus2.EstimatedArrival) }}
                </p>
                <div class="flex flex-col justify-center items-center">
                    <IconsWheelChair
                        v-if="nextBus2?.Feature === 'WAB'"
                        :active="true"
                        :size="size"
                        :color="darkTheme ? '#ffcdb2' : '#6d6875'"
                    />
                    <CardBusTypeIcons
                        :bus-type="nextBus2?.Type"
                        :color="busLoadTextColor(nextBus2?.Load)"
                    />
                </div>
            </div>
        </div>
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
