const STOIC_QUOTES = [
  { text: "The happiness of your life depends upon the quality of your thoughts.", author: "Marcus Aurelius" },
  { text: "We suffer more often in imagination than in reality.", author: "Seneca" },
  { text: "No man is free who is not master of himself.", author: "Epictetus" },
  { text: "The soul becomes dyed with the color of its thoughts.", author: "Marcus Aurelius" },
  { text: "It is not that we have a short time to live, but that we waste a great deal of it.", author: "Seneca" },
  { text: "First say to yourself what you would be; and then do what you have to do.", author: "Epictetus" },
  { text: "Very little is needed to make a happy life; it is all within yourself, in your way of thinking.", author: "Marcus Aurelius" },
  { text: "Luck is what happens when preparation meets opportunity.", author: "Seneca" },
  { text: "He who laughs at himself never runs out of things to laugh at.", author: "Epictetus" },
  { text: "You have power over your mind — not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
  { text: "Difficulties strengthen the mind, as labor does the body.", author: "Seneca" },
  { text: "Don't explain your philosophy. Embody it.", author: "Epictetus" },
  { text: "The impediment to action advances action. What stands in the way becomes the way.", author: "Marcus Aurelius" },
  { text: "We are often more frightened than hurt; and we suffer more from imagination than from reality.", author: "Seneca" },
  { text: "Wealth consists not in having great possessions, but in having few wants.", author: "Epictetus" },
  { text: "When you arise in the morning, think of what a precious privilege it is to be alive.", author: "Marcus Aurelius" },
  { text: "It is not because things are difficult that we do not dare; it is because we do not dare that they are difficult.", author: "Seneca" },
  { text: "If you want to improve, be content to be thought foolish and stupid.", author: "Epictetus" },
  { text: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius" },
  { text: "True happiness is to enjoy the present, without anxious dependence upon the future.", author: "Seneca" },
  { text: "It's not what happens to you, but how you react to it that matters.", author: "Epictetus" },
  { text: "Accept the things to which fate binds you, and love the people with whom fate brings you together.", author: "Marcus Aurelius" },
  { text: "Begin at once to live, and count each separate day as a separate life.", author: "Seneca" },
  { text: "Man is not worried by real problems so much as by his imagined anxieties about real problems.", author: "Epictetus" },
  { text: "The best revenge is not to be like your enemy.", author: "Marcus Aurelius" },
  { text: "As is a tale, so is life: not how long it is, but how good it is, is what matters.", author: "Seneca" },
  { text: "Make the best use of what is in your power, and take the rest as it happens.", author: "Epictetus" },
  { text: "Everything we hear is an opinion, not a fact. Everything we see is a perspective, not the truth.", author: "Marcus Aurelius" },
  { text: "He suffers more than necessary, who suffers before it is necessary.", author: "Seneca" },
  { text: "Freedom is the only worthy goal in life. It is won by disregarding things that lie beyond our control.", author: "Epictetus" },
];

export function getQuoteForDay(dayNumber: number): { text: string; author: string } {
  const index = ((dayNumber - 1) % STOIC_QUOTES.length);
  return STOIC_QUOTES[index];
}
