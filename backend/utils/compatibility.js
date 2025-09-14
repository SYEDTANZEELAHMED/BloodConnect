// recipient -> compatible donor groups
const COMPATIBILITY = {
  "O-": ["O-"],
  "O+": ["O+", "O-"],
  "A-": ["A-", "O-"],
  "A+": ["A+", "A-", "O+", "O-"],
  "B-": ["B-", "O-"],
  "B+": ["B+", "B-", "O+", "O-"],
  "AB-": ["AB-", "A-", "B-", "O-"],
  "AB+": ["AB+","AB-","A+","A-","B+","B-","O+","O-"]
};

function getCompatibleDonors(recipientGroup) {
  return COMPATIBILITY[recipientGroup] || [recipientGroup];
}

module.exports = { getCompatibleDonors };
