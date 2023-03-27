<script lang="ts">
import { defineComponent, ref } from 'vue';
import LogoSVG from '@/assets/UwULogo.vue';
import TrackedMounts from '@/json/TrackedMounts.json';
import MemberInfo from '@/json/MemberInfo.json';
import Dropdown from '@/components/Dropdown.vue';
import Checkbox from '@/components/Checkbox.vue';
import TableHeadCell from '@/components/TableHeadCell.vue';
import TableRow from '@/components/TableRow.vue';
import TableCell from '@/components/TableCell.vue';

interface Member {
  name: string;
  ID: number;
  Mounts: {
    Icon: string,
    Name: string
  }[];
};

interface Mount {
  Expansion: string;
  ID: number;
  Icon: string;
  Name: string;
}

interface MemberArr extends Array<Member>{};
interface MountArr extends Array<Mount>{};

export default defineComponent({
  components: {
    LogoSVG,
    Dropdown,
    Checkbox,
    TableHeadCell,
    TableRow,
    TableCell
  },
  data() {
    return {
      selectedMembers: ref([]),
      selectedExpansions: ref([]),
      neededMounts: [] as any,
      trackedMounts: TrackedMounts as MountArr,
      memberInfo: MemberInfo as MemberArr,
      expansions: [
        {
          ID: 'ARR',
          Name: 'A Realm Reborn'
        },
        {
          ID: 'HW',
          Name: 'Heavensward'
        },
        {
          ID: 'STB',
          Name: 'Stormblood'
        },
        {
          ID: 'SHB',
          Name: 'Shadowbringers'
        },
        {
          ID: 'EW',
          Name: 'Endwalker'
        }
      ]
    };
  },
  mounted() {
    this.commonNeededMounts();
    this.neededMounts = this.sortNeededMounts(this.neededMounts);
  },
  beforeUpdate() {
    this.commonNeededMounts();
    this.neededMounts = this.sortNeededMounts(this.neededMounts);
  },
  methods: {
    resetMembers() {
      this.selectedMembers = [];
    },
    resetExpansions() {
      this.selectedExpansions = [];
    },
    sortNeededMounts(neededMounts: any[]) {
      const sortedNeededMounts = neededMounts.sort((mount1, mount2) => {
        if (mount1.Missing > mount2.Missing) return -1;
        if (mount1.Missing < mount2.Missing) return 1;

        return 0;
      });
      return sortedNeededMounts;
    },
    matchObjectItems(objectItems: any, matchedItem: any) {
      return Object.keys(objectItems).some((k: any) => objectItems[k] === matchedItem.toString());
    },
    filterItems(itemArr: any, selectedFilters: any, key: string) {
      return itemArr.filter((item: any) => {
        return this.matchObjectItems(selectedFilters, item[key]);
      })
    },
    matchValues(arr: {Icon: string, Name: string}[], value: string) {
      if (!arr) return false;
      return arr.some(({ Name }) => Name.toLowerCase() === value.toLowerCase());
    },
    commonNeededMounts() {
      const visibleMounts = this.selectedExpansions.length
        ? this.filterItems(this.trackedMounts, this.selectedExpansions, 'Expansion')
        : this.trackedMounts;

      const visibleMembers = this.selectedMembers.length
        ? this.filterItems(this.memberInfo, this.selectedMembers, 'ID')
        : this.memberInfo;

      this.neededMounts = visibleMounts.map((mount: any) => {
        return {
          ...mount,
          Missing: 0
        }
      });
      
      this.neededMounts.forEach((mount: any) => {
        if (visibleMembers) {
          visibleMembers.forEach((member: any) => {
            if (member.Mounts) {
              const foundMount = member.Mounts.find((mMount: any) => mMount.Name.toLowerCase() === mount.Name.toLowerCase());
              
              if (!foundMount) {
                mount.Missing = mount.Missing + 1;
              }
            }
          });
        }
      });
    },
    memberVisible(row: any) {
      const matchedValue = this.memberInfo.find((member) => member.ID === row.ID);
      const matchedID: number = matchedValue ? matchedValue.ID : 0;

      if (matchedValue) {
        return this.matchObjectItems(this.selectedMembers, matchedID);
      } else {
        return false;
      }
    },
    expansionVisible(col: any) {
      const matchedValue = this.trackedMounts.find((mount) => mount.Expansion === col.Expansion);
      const matchedID: string = matchedValue ? matchedValue.Expansion : '';

      if (matchedValue) {
        return this.matchObjectItems(this.selectedExpansions, matchedID);
      } else {
        return false;
      }
    },
  }
});
</script>

<template>
  <div>
    <div>Top 3 Needed Mounts</div>
    <div class="flex">
      <div
        class="flex items-end ml-4"
        v-for="(mount, index) in neededMounts.slice(0, 3)"
      >
        <span class="align-bottom">{{ index + 1 }}.</span>
        <span v-if="mount.Missing > 0" class="w-20">
          <img :src="mount.Icon" :alt="mount.Name" :title="mount.Name" class="w-20">
        </span>
      </div>
    </div>
  </div>

  <main class="pb-20">
    <div class="mt-8 flex">
      <div>
        <Dropdown describer="Select Members">
          <li class="border-b border-zinc-600"><button @click="resetMembers" class="w-full text-left px-4 py-1">Reset</button></li>

          <Checkbox 
            v-for="member in memberInfo"
            :key="member.ID"
            v-model="selectedMembers" 
            name="selectedMembers"
            :id="`${member.ID}`"
            :label="member.name"
            :value="`${member.ID}`"
          />
        </Dropdown>
      </div>

      <div class="ml-8">
        <Dropdown describer="Select Expansion">
          <li class="border-b border-zinc-600"><button @click="resetExpansions" class="w-full text-left px-4 py-1">Reset</button></li>

          <Checkbox 
            v-for="expansion in expansions"
            :key="expansion.ID"
            v-model="selectedExpansions" 
            name="selectedExpansions"
            :id="`${expansion.ID}`"
            :label="expansion.Name"
            :value="`${expansion.ID}`"
          />
        </Dropdown>
      </div>
    </div>

    <div class="mt-8 flex w-full">
      <div class="flex-none">
        <div class="h-14 pl-2 flex items-center text-xl">Mounts</div>
        <template
          v-for="(member, index) in memberInfo"
          :key="member.ID"
        >
          <div 
            v-if="!selectedMembers.length || memberVisible(member)"
            :class="{ 'bg-zinc-800': index % 2 }"
            class="h-8 pl-2 pr-4 flex items-center"
          >{{ member.name }}</div>
        </template>
      </div>

      <div class="flex-1 overflow-auto">
        <table class="table-auto">
          <thead>
            <tr>
              <TableHeadCell
                v-for="mount in trackedMounts"
                :key="mount.ID"
                :mountVisible="!selectedExpansions.length || expansionVisible(mount)"
                :mount="mount"
              />
            </tr>
          </thead>
          <tbody>
            <TableRow
              v-for="(member, index) in memberInfo"
              :key="member.ID"
              :index="index"
              :memberVisible="!selectedMembers.length || memberVisible(member)"
            >
              <TableCell 
                v-for="mount in trackedMounts"
                :key="mount.ID"
                :expansion="mount.Expansion"
                :expansionVisible="!selectedExpansions.length || expansionVisible(mount)"
                :hasMount="matchValues(member.Mounts, mount.Name)"
              />
            </TableRow>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>
