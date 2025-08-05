export interface DataLog {
  id: string;
  timestamp: Date;
  tags: string[];
  content: string;
  images: string[];
  links: string[];
}

export const dataLogs: DataLog[] = [
  {
    id: "[garden]-weed-hat",
    timestamp: new Date("2025-08-03T13:38:20Z"),
    tags: ["garden", "doggo", "jmill", "eccentric"],
    content:
      "Daily garden walk and check, Jamaican cherry, doing well, watermelon, growing, two are very big now, the weeds, we really need to get rid of a lot of them before we leave. Jmill grabbed a whole cluster of weed and put it on his head, so funny such a typical doggo behavior.",
    images: ["/cuttie/6.webp"],
    links: [],
  },
  {
    id: "[brain-farts]-venture funding fire",
    timestamp: new Date("2025-08-03T03:38:20Z"),
    tags: ["brain farts"],
    images: [],
    content: `The first caveman that discovered fire: “I’ll raise 400 sea shells 🐚 on 10k sea shells post money valuation.” Caveman Patent Office: “Just fill out these three walls for the new patent”. Hater caveman: “Bro why I want fire, I could just wear more furs, sitting around fire makes me lazy, raw food is good for your health anyway.” Replace fire with AI and caveman with us LOL`,
    links: [],
  },
  {
    id: "walk-my-doggo",
    timestamp: new Date("2025-08-02T17:30:00Z"),
    tags: ["doggo", "walk", "jmill", "botanical garden", "orlando"],
    content:
      "Walked my doggo for half an hour in Mead Botanical Garden after coffee. He was so happy and so was I. As we took pictures in the garden trying to identify the plants we don't know, Doggo busted out this app called Seek by iNatualist that is completely free and have accomplishment badges. That's pretty cool, I wish we have more free and wholsesome apps like this.",
    images: ["/cuttie/1.webp", "/cuttie/2.webp"],
    links: ["https://share.google/gYAckrd9hOsganbTN"],
  },

  {
    id: "black-phine-coffee-bar",
    timestamp: new Date("2025-08-02T16:30:00Z"),
    tags: ["coffee", "vibe coding", "orlando"],
    content:
      "Discovered a random coffe place in orlando that has a super chill interior, a lot of plants, Asian-owned, good vibe.",
    images: ["/cuttie/0.webp"],
    links: ["https://share.google/GLe4MlvcwqZLLkZno"],
  },
  {
    id: "florida-sky",
    timestamp: new Date("2025-08-02T00:32:15Z"),
    tags: ["sky", "orlando", "florida"],
    content:
      "Florida always has this trippy looking sky that would literally paint every white painted house dreamy purple. That's how I discovered this sky. No Photoshop. Absolutely breathtaking.",
    images: ["/cuttie/3.webp"],
    links: [],
  },
  {
    id: "[thursday-dinner-series]-talay",
    timestamp: new Date("2025-08-02T18:35:42Z"),
    tags: ["thursday", "dinner", "thai food", "orlando"],
    content:
      "My family and I tried Talay on Thursday for dinner. I had been wanting to go there for a while, but since I came back from Thailand, I've been too spoiled by the cheap, delicious food there, so I kept putting it off. It turns out it's a very authentic place, and their raw shrimp (Goong Chae Nam Pla) is really good. Their crying tiger (Sua Rong Hai) is also on point. Their cocktail and zero-proof menu also looks like they put a lot of effort and creative energy into it.",
    images: ["/cuttie/4.webp", "/cuttie/5.webp"],
    links: [],
  },

  {
    id: "[cat]-my-oranges",
    timestamp: new Date("2025-07-28T08:40:05Z"),
    tags: ["oranges", "cat", "kitties", "cara", "tangerine"],
    content:
      "Enjoy their big stretches :D, the first one is Cara, female orange tabby with Turkish van medium hair, the second one is Tangerine, male orange tabby domestic short hair.",
    images: ["/cuttie/8.webp", "/cuttie/7.webp"],
    links: [],
  },
  {
    id: "[garden]-biggest venus mango",
    timestamp: new Date("2025-07-26T08:42:33Z"),
    tags: ["garden", "mango"],
    content:
      "We harvested the biggest mango on our Venus mango tree. 2.5Ibs, or over 1kg.",
    images: ["/cuttie/9.webp"],
    links: [],
  },
  {
    id: "[thursday-dinner-series]-chilispot",
    timestamp: new Date("2025-07-24T18:35:42Z"),
    tags: ["thursday", "dinner", "chinese food", "orlando"],
    content:
      "We went to chilispot again for our Thursday dinner when we don't know where to go. We thought about Indian food but between Indian food and Chilispot, there's one obious winner.",
    images: ["/cuttie/10.webp"],
    links: [],
  },
  {
    id: "[thursday-dinner-series]-prato",
    timestamp: new Date("2025-07-17T18:35:42Z"),
    tags: ["thursday", "dinner", "italian food", "orlando"],
    content:
      "We went to Prato and usually they won't have any walk-ins, but they say if we come right when it's open, we can get a table. The best pizza there is still the mushroom pizza, unbeatable. Their tiramisu dessert is also a must eat.",
    images: ["/cuttie/11.webp", "/cuttie/12.webp", "/cuttie/13.webp"],
    links: [],
  },
];
