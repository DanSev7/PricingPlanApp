// screens/TeamDetailScreen.tsx (Modern Profile View)
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

// --- Color Constants ---
const BG_COLOR = '#0f172b';
const CARD_COLOR = '#1d293b';
const TINT_COLOR = '#09b6d4';
const TEXT_COLOR = '#ffffff';

export default function TeamDetailScreen() {
    const router = useRouter();
    // Ensure params are handled correctly, as useLocalSearchParams returns strings
    const params = useLocalSearchParams();
    const name = params.name as string;
    const role = params.role as string;
    const imageAsset = params.imageAsset; // Local asset only
    const email = params.email as string;

    // Team member-specific content based on name
    const getMemberDetails = (memberName: string) => {
        switch(memberName) {
            case 'Mr. Ephrem Gebeyehu':
                return {
                    bio: 'CEO and Founder of Ethiotech Leaders with over 15 years of experience in digital transformation and technology leadership. Passionate about empowering African leaders with cutting-edge technological skills.',
                    expertise: [
                        'Digital Transformation Strategy',
                        'Leadership Development',
                        'Technology Policy',
                        'Innovation Management'
                    ],
                    achievements: [
                        'Led digital transformation for 50+ organizations',
                        'Published author on technology leadership',
                        'International speaker on digital innovation'
                    ]
                };
            case 'Sara Ayele':
                return {
                    bio: 'Mobile App Developer with expertise in React Native and cross-platform development. Specializes in creating intuitive user interfaces and seamless user experiences for educational technology platforms.',
                    expertise: [
                        'React Native Development',
                        'UI/UX Design',
                        'Cross-platform Solutions',
                        'Performance Optimization'
                    ],
                    achievements: [
                        'Developed 20+ mobile applications',
                        'Tech conference speaker',
                        'Open-source contributor'
                    ]
                };
            case 'Daniel Ayele':
                return {
                    bio: 'Backend Developer with extensive experience in cloud architecture and scalable systems. Focuses on building robust, secure, and efficient backend solutions for enterprise applications.',
                    expertise: [
                        'Cloud Architecture',
                        'API Development',
                        'Database Design',
                        'System Security'
                    ],
                    achievements: [
                        'Architected systems serving 1M+ users',
                        'Security certification holder',
                        'Mentor for junior developers'
                    ]
                };
            case 'Mesfin Mamo':
                return {
                    bio: 'Finance professional with expertise in accounting and financial management for technology startups. Brings financial acumen and strategic planning to ensure sustainable growth and profitability.',
                    expertise: [
                        'Financial Management',
                        'Strategic Planning',
                        'Budgeting & Forecasting',
                        'Startup Finance'
                    ],
                    achievements: [
                        'Managed finances for 10+ startups',
                        'CPA certified',
                        'Financial strategy consultant'
                    ]
                };
            default:
                return { bio: '', expertise: [], achievements: [] };
        }
    };

    const memberDetails = getMemberDetails(name);

    // Function to navigate to contact screen
    const handleContactPress = () => {
        router.push({
            pathname: '/screens/team-contact',
            params: {
                recipientEmail: email,
                recipientName: name
            }
        });
    };

    return (
        <ThemedView style={[styles.container, { backgroundColor: BG_COLOR }]}>
            {/* Back Arrow */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={26} color={TINT_COLOR} />
            </TouchableOpacity>
            
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <ThemedView style={[styles.profileHeader, { backgroundColor: CARD_COLOR }]}>
                    {imageAsset ? (
                        // Local asset
                        <Image
                            source={typeof imageAsset === 'number' ? imageAsset : parseInt(imageAsset as string)}
                            style={[styles.profileImage, { borderColor: TINT_COLOR }]}
                            contentFit="cover"
                        />
                    ) : (
                        <ThemedView style={[styles.imagePlaceholder, { backgroundColor: TINT_COLOR }]}>
                            <ThemedText style={styles.placeholderText}>
                                {name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'NN'}
                            </ThemedText>
                        </ThemedView>
                    )}
                    
                    <ThemedText type="title" style={[styles.name, { color: TEXT_COLOR }]}>
                        {name}
                    </ThemedText>
                    <ThemedText style={[styles.role, { color: TINT_COLOR }]}>
                        {role}
                    </ThemedText>
                </ThemedView>
                
                {memberDetails.bio ? (
                    <ThemedView style={[styles.section, { backgroundColor: CARD_COLOR }]}>
                        <ThemedText type="subtitle" style={[styles.sectionTitle, { color: TINT_COLOR }]}>
                            Biography
                        </ThemedText>
                        <ThemedText style={[styles.bioText, { color: TEXT_COLOR + 'cc' }]}>
                            {memberDetails.bio}
                        </ThemedText>
                    </ThemedView>
                ) : null}
                
                {memberDetails.expertise.length > 0 && (
                    <ThemedView style={[styles.section, { backgroundColor: CARD_COLOR }]}>
                        <ThemedText type="subtitle" style={[styles.sectionTitle, { color: TINT_COLOR }]}>
                            Areas of Expertise
                        </ThemedText>
                        <View style={styles.chipContainer}>
                            {memberDetails.expertise.map((expertise, index) => (
                                <ThemedView key={index} style={[styles.chip, { borderColor: TINT_COLOR, backgroundColor: TINT_COLOR + '20' }]}>
                                    <ThemedText style={[styles.chipText, { color: TEXT_COLOR }]}>{expertise}</ThemedText>
                                </ThemedView>
                            ))}
                        </View>
                    </ThemedView>
                )}
                
                {memberDetails.achievements.length > 0 && (
                    <ThemedView style={[styles.section, { backgroundColor: CARD_COLOR }]}>
                        <ThemedText type="subtitle" style={[styles.sectionTitle, { color: TINT_COLOR }]}>
                            Key Achievements
                        </ThemedText>
                        {memberDetails.achievements.map((achievement, index) => (
                            <View key={index} style={styles.listItem}>
                                <Ionicons name="trophy" size={20} color={TINT_COLOR} style={styles.listIcon} />
                                <ThemedText style={[styles.listText, { color: TEXT_COLOR + 'cc' }]}>{achievement}</ThemedText>
                            </View>
                        ))}
                    </ThemedView>
                )}
                
                <TouchableOpacity 
                    style={[styles.contactButton, { borderColor: TINT_COLOR }]}
                    activeOpacity={0.8}
                    onPress={handleContactPress}
                >
                    <ThemedText style={[styles.contactText, { color: TEXT_COLOR }]}>
                        Contact {name || 'Member'}
                    </ThemedText>
                </TouchableOpacity>
                <View style={{ height: 40 }} />
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: 'rgba(15, 23, 43, 0.9)', // Dark background with higher opacity
    borderRadius: 20,
    elevation: 8, // Increased elevation
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 8 }, // Increased shadow offset
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  profileHeader: {
    // marginHorizontal: 15,
        marginBottom: 20, // Increased bottom margin
        borderRadius: 25, // More rounded corners
        padding: 15, // More generous padding
        alignItems: 'center',
        // Emphasis on the CEO card using the TINT_COLOR accent
        borderWidth: 0.5, 
        borderColor: TINT_COLOR + '20', 
        shadowColor: TINT_COLOR, 
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    // alignItems: 'center',
    // marginBottom: 24,
    // padding: 30, // Increased padding
    // borderRadius: 20, // More rounded
    // shadowColor: TINT_COLOR,
    // shadowOffset: { width: 0, height: 6 },
    // shadowOpacity: 0.2,
    // shadowRadius: 10,
    // elevation: 8,
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginBottom: 16,
    borderWidth: 2.5,
  },
  imagePlaceholder: {
    width: 130,
    height: 130,
    borderRadius: 65,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 50,
    fontWeight: '400',
    color: TEXT_COLOR,
  },
  name: {
    textAlign: 'center',
    marginBottom: 4,
    fontSize: 28, // Larger name
    fontWeight: '600',
  },
  role: {
    fontSize: 16, // Slightly larger role text
    opacity: 0.9,
    textAlign: 'center',
  },
  section: {
        marginBottom: 20, // Increased bottom margin
        borderRadius: 25, // More rounded corners
        padding: 15, // More generous padding
        alignItems: 'center',
        // Emphasis on the CEO card using the TINT_COLOR accent
        borderWidth: 0.5, 
        borderColor: TINT_COLOR + '20', 
        shadowColor: TINT_COLOR, 
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3,
    // marginBottom: 20,
    // padding: 24, // Consistent padding
    // borderRadius: 16,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.15,
    // shadowRadius: 4,
    // elevation: 4,
  },
  sectionTitle: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '600',
    borderBottomWidth: 1,
    paddingBottom: 5,
    borderColor: TINT_COLOR + '40',
  },
  bioText: {
    fontSize: 15,
    lineHeight: 20,
    opacity: 0.9,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10, // Increased gap
  },
  chip: {
    borderWidth: 0.5,
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  listIcon: {
    marginRight: 10,
    marginTop: 1,
    fontSize: 20,
  },
  listText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.9,
  },
  contactButton: {
    borderWidth: 1.5,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 70,
    borderColor: TINT_COLOR,
    backgroundColor: 'rgba(9, 182, 212, 0.1)',
  },
  contactText: {
    fontSize: 18,
    fontWeight: '600',
    color: TEXT_COLOR,
  },
});
