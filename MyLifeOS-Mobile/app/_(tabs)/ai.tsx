/**
 * AI 助理屏幕 - 对话和建议
 */

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native';
import { useAppStore } from '../../store/appStore';
import { Feather } from '@expo/vector-icons';
import { AISuggestion } from '../../core/aiAgent';

export default function AIScreen() {
  const {
    aiSuggestions,
    isAnalyzing,
    executeAIChat,
    executeAutoAnalyze,
    applySuggestion,
  } = useAppStore();

  const [messages, setMessages] = useState<
    Array<{ role: 'user' | 'assistant'; content: string }>
  >([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<AISuggestion | null>(
    null
  );

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setInputValue('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await executeAIChat(userMessage);
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `[ERROR] ${error.message || '请求失败'}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoAnalyze = async () => {
    await executeAutoAnalyze();
    Alert.alert('分析完成', `收到 ${aiSuggestions.length} 条建议`);
  };

  const handleApplySuggestion = async (suggestion: AISuggestion) => {
    await applySuggestion(suggestion);
    Alert.alert('成功', '建议已应用');
    setSelectedSuggestion(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#080b10" />

      <View style={styles.header}>
        <Text style={styles.title}>
          <Text style={styles.blue}>[AI]</Text> ASSISTANT
        </Text>
        <TouchableOpacity
          style={styles.analyzeButton}
          onPress={handleAutoAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <ActivityIndicator color="#00ff9d" size={20} />
          ) : (
            <Feather name="zap" size={20} color="#00ff9d" />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* 标签页 */}
        <View style={styles.tabs}>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.activeTab}>💬 对话</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <View style={styles.badgeContainer}>
              <Text style={styles.tab}>💡 建议 ({aiSuggestions.length})</Text>
              {aiSuggestions.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{aiSuggestions.length}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* 聊天窗口或建议列表 */}
        <ScrollView style={styles.chatArea}>
          {messages.length === 0 && aiSuggestions.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="message-square" size={48} color="#1a1f2e" />
              <Text style={styles.emptyText}>
                开始对话或点击"自动分析"获取建议
              </Text>
            </View>
          ) : messages.length > 0 ? (
            messages.map((msg, idx) => (
              <View
                key={idx}
                style={[
                  styles.message,
                  msg.role === 'user'
                    ? styles.messageUser
                    : styles.messageAssistant,
                ]}
              >
                <Text style={styles.messageLabel}>
                  <Text
                    style={
                      msg.role === 'user' ? styles.green : styles.blue
                    }
                  >
                    [{msg.role === 'user' ? 'USER' : 'AI'}]
                  </Text>
                </Text>
                <Text style={styles.messageContent}>{msg.content}</Text>
              </View>
            ))
          ) : (
            <FlatList
              scrollEnabled={false}
              data={aiSuggestions}
              renderItem={({ item: suggestion }) => (
                <TouchableOpacity
                  style={styles.suggestionCard}
                  onPress={() => setSelectedSuggestion(suggestion)}
                >
                  <View style={styles.suggestionHeader}>
                    <Text style={styles.suggestionType}>[{suggestion.type}]</Text>
                    <Text
                      style={[
                        styles.suggestionPriority,
                        styles[`priority_${suggestion.priority}`],
                      ]}
                    >
                      {suggestion.priority}
                    </Text>
                  </View>
                  <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
                  <Text style={styles.suggestionDesc}>
                    {suggestion.description.substring(0, 80)}...
                  </Text>
                  <Text style={styles.suggestionConfidence}>
                    置信度: {(suggestion.confidence * 100).toFixed(0)}%
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
            />
          )}

          {isLoading && (
            <View style={styles.loadingMessage}>
              <ActivityIndicator color="#00e5ff" size={24} />
              <Text style={styles.loadingText}>AI 正在思考...</Text>
            </View>
          )}
        </ScrollView>

        {/* 选中的建议详情 */}
        {selectedSuggestion && (
          <View style={styles.suggestionDetail}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailTitle}>{selectedSuggestion.title}</Text>
              <TouchableOpacity onPress={() => setSelectedSuggestion(null)}>
                <Feather name="x" size={20} color="#e0e6f1" />
              </TouchableOpacity>
            </View>
            <Text style={styles.detailDesc}>{selectedSuggestion.description}</Text>

            <View style={styles.actionsList}>
              {selectedSuggestion.actions.map((action) => (
                <View key={action.actionId} style={styles.actionItem}>
                  <Text style={styles.actionType}>[{action.actionType}]</Text>
                  <Text style={styles.actionDesc}>{action.description}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => handleApplySuggestion(selectedSuggestion)}
            >
              <Feather name="check" size={20} color="#00ff9d" />
              <Text style={styles.applyButtonText}>一键应用</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* 输入框 */}
      {messages.length > 0 || selectedSuggestion === null ? (
        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            placeholder="输入问题或指令..."
            placeholderTextColor="#666"
            value={inputValue}
            onChangeText={setInputValue}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
            disabled={isLoading}
          >
            <Text style={styles.sendButtonText}>
              <Text style={styles.green}>&gt;</Text>
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080b10',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1f2e',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e0e6f1',
  },
  blue: {
    color: '#00e5ff',
    textShadowColor: '#00e5ff',
    textShadowRadius: 8,
  },
  green: {
    color: '#00ff9d',
  },
  analyzeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1f2e',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#1a1f2e',
  },
  activeTab: {
    color: '#00ff9d',
    fontWeight: '600',
  },
  badgeContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ff1744',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  chatArea: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#a8b2c1',
    marginTop: 16,
    textAlign: 'center',
  },
  message: {
    marginVertical: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderLeftWidth: 3,
  },
  messageUser: {
    borderLeftColor: '#00ff9d',
  },
  messageAssistant: {
    borderLeftColor: '#00e5ff',
  },
  messageLabel: {
    fontSize: 10,
    marginBottom: 4,
  },
  messageContent: {
    fontSize: 12,
    color: '#e0e6f1',
    lineHeight: 18,
  },
  loadingMessage: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  loadingText: {
    color: '#e0e6f1',
    marginTop: 8,
  },
  suggestionCard: {
    backgroundColor: 'rgba(15, 20, 25, 0.8)',
    borderWidth: 1,
    borderColor: '#1a1f2e',
    borderRadius: 4,
    padding: 12,
    marginVertical: 8,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  suggestionType: {
    fontSize: 11,
    color: '#00e5ff',
  },
  suggestionPriority: {
    fontSize: 10,
    fontWeight: '600',
  },
  priority_low: {
    color: '#00e5ff',
  },
  priority_medium: {
    color: '#ffaa00',
  },
  priority_high: {
    color: '#ff6600',
  },
  priority_critical: {
    color: '#ff1744',
  },
  suggestionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e0e6f1',
    marginBottom: 4,
  },
  suggestionDesc: {
    fontSize: 11,
    color: '#a8b2c1',
    marginBottom: 8,
  },
  suggestionConfidence: {
    fontSize: 10,
    color: '#00ff9d',
  },
  suggestionDetail: {
    backgroundColor: 'rgba(15, 20, 25, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#1a1f2e',
    padding: 12,
    maxHeight: '40%',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e0e6f1',
    flex: 1,
  },
  detailDesc: {
    fontSize: 12,
    color: '#a8b2c1',
    marginBottom: 8,
  },
  actionsList: {
    marginVertical: 8,
  },
  actionItem: {
    marginBottom: 6,
  },
  actionType: {
    fontSize: 10,
    color: '#00e5ff',
  },
  actionDesc: {
    fontSize: 11,
    color: '#e0e6f1',
    marginTop: 2,
  },
  applyButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 157, 0.1)',
    borderWidth: 1,
    borderColor: '#00ff9d',
    borderRadius: 4,
    paddingVertical: 10,
    gap: 8,
    marginTop: 8,
  },
  applyButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00ff9d',
  },
  inputArea: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#1a1f2e',
    backgroundColor: 'rgba(15, 20, 25, 0.8)',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: '#1a1f2e',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#e0e6f1',
    fontSize: 12,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: 'rgba(0, 255, 157, 0.1)',
    borderWidth: 1,
    borderColor: '#1a1f2e',
    borderRadius: 4,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
